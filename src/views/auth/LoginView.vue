<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "../../services/authService";
import { saveToken } from "../../utils/authStorage";

const router = useRouter();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);
const errorMessage = ref("");
const submitting = ref(false);

async function handleSubmit() {
  errorMessage.value = "";
  submitting.value = true;
  try {
    const { token } = await loginUser(email.value, password.value);
    saveToken(token, rememberMe.value);
    await router.push({ name: "residents" });
  } catch (error) {
    errorMessage.value =
      error?.status === 401
        ? "El correo o la contraseña no son correctos."
        : "No se ha podido iniciar sesión. Inténtalo de nuevo.";
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main
    class="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-4 py-10"
    style="background-image: radial-gradient(#cdd5e0 1.2px, transparent 1.2px); background-size: 22px 22px;"
  >
    <section class="w-full max-w-md rounded-2xl bg-surface p-10 text-center shadow-xl">
      <img src="../../assets/logo.png" alt="ElderCare" class="mx-auto mb-5 h-14 object-contain" />

      <h1 class="text-3xl font-extrabold text-text">Inicio de sesión</h1>
      <p class="mt-1.5 mb-7 text-sm text-text-muted">
        Por favor, inicie sesión en su cuenta.
      </p>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="relative flex items-center">
          <span class="absolute left-4 text-text-muted" aria-hidden="true">✉</span>
          <label class="sr-only" for="email">Correo electrónico</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Correo electrónico"
            autocomplete="email"
            required
            class="w-full rounded-xl border border-border py-3.5 pl-11 pr-4 text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div class="relative flex items-center">
          <span class="absolute left-4 text-text-muted" aria-hidden="true">🔒</span>
          <label class="sr-only" for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Contraseña"
            autocomplete="current-password"
            required
            class="w-full rounded-xl border border-border py-3.5 pl-11 pr-11 text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <button
            type="button"
            class="absolute right-3 text-text-muted"
            :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? "🙈" : "👁" }}
          </button>
        </div>

        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 text-text">
            <input v-model="rememberMe" type="checkbox" class="h-4 w-4" />
            Recordar sesión
          </label>
          <a href="#" class="text-accent hover:underline">¿Has olvidado tu contraseña?</a>
        </div>

        <p v-if="errorMessage" class="text-left text-sm text-error" role="alert">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="submitting"
          class="mt-2 rounded-full bg-navy py-3.5 font-semibold text-white transition-colors hover:bg-navy-dark disabled:opacity-60"
        >
          {{ submitting ? "Iniciando sesión…" : "Iniciar sesión" }}
        </button>
      </form>
    </section>

    <footer class="text-sm text-text-muted">© 2024 ElderCare Management</footer>
  </main>
</template>