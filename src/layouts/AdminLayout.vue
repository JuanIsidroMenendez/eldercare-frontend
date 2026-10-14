<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { clearToken } from "../utils/authStorage";

const router = useRouter();

const mobileNavOpen = ref(false);

const navItems = [
  { name: "residents", label: "Residentes", icon: "M12 4a4 4 0 100 8 4 4 0 000-8zM4 20a8 8 0 0116 0" },
  //{ name: "rooms", label: "Habitaciones", icon: "M3 7l9-4 9 4v10l-9 4-9-4V7z" },
  //{ name: "professionals", label: "Profesionales", icon: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87" },
];

function logout() {
  clearToken();
  router.push({ name: "login" });
}
</script>

<template>
  <div class="min-h-screen bg-bg text-text">
    <header class="bg-navy text-white">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div class="flex items-center gap-3">
          <button
            class="rounded-lg p-2 hover:bg-navy-dark md:hidden"
            @click="mobileNavOpen = !mobileNavOpen"
            aria-label="Abrir menú"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span class="text-lg font-bold tracking-tight">Eldercare</span>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden text-right sm:block">
            <p class="text-sm font-semibold leading-tight">Carlos</p>
            <p class="text-xs text-white/70 leading-tight">Director</p>
          </div>
          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold">
            L
          </div>
          <button class="rounded-lg p-2 hover:bg-navy-dark" @click="logout" aria-label="Cerrar sesión">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <div class="mx-auto flex max-w-6xl">
      <aside class="hidden w-56 shrink-0 border-r border-border bg-surface md:block">
        <nav class="flex flex-col gap-1 p-4">
          <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="{ name: item.name }"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-bg"
            active-class="bg-navy/10 text-navy"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
            </svg>
            {{ item.label }}
          </RouterLink>
        </nav>
      </aside>

      <div
        v-if="mobileNavOpen"
        class="fixed inset-0 z-20 bg-black/40 md:hidden"
        @click="mobileNavOpen = false"
      ></div>
      <aside
        v-if="mobileNavOpen"
        class="fixed left-0 top-16 bottom-0 z-30 w-56 bg-surface shadow-xl md:hidden"
      >
        <nav class="flex flex-col gap-1 p-4">
          <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="{ name: item.name }"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-bg"
            active-class="bg-navy/10 text-navy"
            @click="mobileNavOpen = false"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
            </svg>
            {{ item.label }}
          </RouterLink>
        </nav>
      </aside>

      <main class="flex-1 px-4 py-6 pb-24 md:pb-6">
        <RouterView />
      </main>
    </div>

    <nav class="fixed bottom-0 left-0 right-0 z-10 flex border-t border-border bg-surface md:hidden">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="flex flex-1 flex-col items-center gap-1 py-2 text-xs text-text-muted"
        active-class="text-navy"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
        </svg>
        {{ item.label }}
      </RouterLink>
    </nav>
  </div>
</template>