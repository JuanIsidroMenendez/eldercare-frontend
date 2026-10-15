<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getResident, createResident, updateResident } from "../../services/residentService.js";
import { gradeLabel } from "../../utils/grade.js";
import BaseInput from "../../components/BaseInput.vue";
import BaseSelect from "../../components/BaseSelect.vue";

const route = useRoute();
const router = useRouter();

const residentId = route.params.id || null;
const isEdit = computed(() => !!residentId);

// Formulario.
const form = reactive({
  photo: "",
  firstName: "",
  lastName: "",
  age: "",
  dependencyGrade: "",
  street: "",
  city: "",
  postalCode: "",
  familyName: "",
  relationship: "",
  phone: "",
  professional: "",
});

const errors = reactive({});
const loading = ref(false);
const submitting = ref(false);
const serverError = ref("");

// gradeLabel.js.
const gradeOptions = [
  { value: "SIN_GRADO", label: gradeLabel("SIN_GRADO") },
  { value: "GRADO_I", label: gradeLabel("GRADO_I") },
  { value: "GRADO_II", label: gradeLabel("GRADO_II") },
  { value: "GRADO_III", label: gradeLabel("GRADO_III") },
];

async function loadForEdit() {
  loading.value = true;
  try {
    const r = await getResident(residentId);
    form.photo = r.photo ?? "";
    form.firstName = r.firstName ?? "";
    form.lastName = r.lastName ?? "";
    form.age = r.age ?? "";
    form.dependencyGrade = r.dependencyGrade ?? "";
    form.street = r.street ?? "";
    form.city = r.city ?? "";
    form.postalCode = r.postalCode ?? "";
    form.familyName = r.familyName ?? "";
    form.relationship = r.relationship ?? "";
    form.phone = r.phone ?? "";
    form.professional = r.professional ?? "";
  } catch (e) {
    serverError.value = "No se pudo cargar el residente.";
  } finally {
    loading.value = false;
  }
}

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (!form.firstName.trim()) errors.firstName = "El nombre es obligatorio.";
  if (!form.lastName.trim()) errors.lastName = "Los apellidos son obligatorios.";
  if (!form.age || Number(form.age) <= 0) errors.age = "Edad no válida.";
  if (!form.dependencyGrade) errors.dependencyGrade = "Selecciona un grado.";
  return Object.keys(errors).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;
  submitting.value = true;
  serverError.value = "";

  // Resident DTO del backend.
  const payload = {
    photo: form.photo || null,
    firstName: form.firstName,
    lastName: form.lastName,
    age: Number(form.age), 
    dependencyGrade: form.dependencyGrade,
    street: form.street,
    city: form.city,
    postalCode: form.postalCode,
    familyName: form.familyName,
    relationship: form.relationship,
    phone: form.phone,
    professional: form.professional,
  };

  try {
    if (isEdit.value) {
      await updateResident(residentId, payload);
      router.push({ name: "resident-detail", params: { id: residentId } });
    } else {
      const created = await createResident(payload);
      if (created?.id) router.push({ name: "resident-detail", params: { id: created.id } });
      else router.push({ name: "residents" });
    }
  } catch (e) {
    serverError.value = "No se pudo guardar. Revisa los datos.";
  } finally {
    submitting.value = false;
  }
}

function cancel() {
  router.back();
}

onMounted(() => {
  if (isEdit.value) loadForEdit();
});
</script>

<template>
  <section class="mx-auto max-w-2xl">
    <h1 class="mb-6 text-2xl font-bold text-text">
      {{ isEdit ? "Editar residente" : "Nuevo residente" }}
    </h1>

    <p v-if="loading" class="py-10 text-center text-text-muted">Cargando…</p>

    <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div class="rounded-2xl border border-border bg-surface p-6">
        <!-- Datos personales. -->
        <h2 class="mb-4 text-sm font-semibold text-text">Datos personales</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <BaseInput v-model="form.firstName" label="Nombre" :error="errors.firstName" />
          <BaseInput v-model="form.lastName" label="Apellidos" :error="errors.lastName" />
          <BaseInput v-model="form.age" label="Edad" type="number" :error="errors.age" />
          <BaseSelect
            v-model="form.dependencyGrade"
            label="Grado de dependencia"
            :options="gradeOptions"
            :error="errors.dependencyGrade"
          />
          <div class="sm:col-span-2">
            <BaseInput v-model="form.photo" label="Foto (URL)" placeholder="https://…" />
          </div>
          <div class="sm:col-span-2">
            <BaseInput v-model="form.professional" label="Profesional de referencia" />
          </div>
        </div>
      </div>
      <!-- Domicilio anterior. -->
      <div class="rounded-2xl border border-border bg-surface p-6">
        <h2 class="mb-4 text-sm font-semibold text-text">Domicilio anterior</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <BaseInput v-model="form.street" label="Calle" />
          </div>
          <BaseInput v-model="form.city" label="Ciudad" />
          <BaseInput v-model="form.postalCode" label="Código postal" />
        </div>
      </div>

      <!-- Contacto familiar. -->
      <div class="rounded-2xl border border-border bg-surface p-6">
        <h2 class="mb-4 text-sm font-semibold text-text">Contacto familiar</h2>
        <div class="grid gap-4 sm:grid-cols-3">
          <BaseInput v-model="form.familyName" label="Nombre" />
          <BaseInput v-model="form.relationship" label="Parentesco" />
          <BaseInput v-model="form.phone" label="Teléfono" />
        </div>
      </div>

      <p v-if="serverError" class="text-sm text-error">{{ serverError }}</p>

      <!-- Acciones. -->
      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text hover:bg-surface"
          @click="cancel"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark disabled:opacity-60"
          :disabled="submitting"
        >
          {{ submitting ? "Guardando…" : "Guardar" }}
        </button>
      </div>
    </form>
  </section>
</template>