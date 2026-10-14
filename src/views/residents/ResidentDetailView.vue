<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getResident, deleteResident } from "../../services/residentService";
import { gradeLabel } from "../../utils/grade";
import InfoField from "../../components/InfoField.vue";
import { getRooms, assignResident, removeResident } from "../../services/roomService";
import BaseSelect from "../../components/BaseSelect.vue";

const route = useRoute();
const router = useRouter();

const resident = ref(null);
const loading = ref(true);
const error = ref("");

const residentId = route.params.id;

//Estado de asignación de la habitación.
const rooms = ref([]);
const selectedRoomId = ref("");
const assignError = ref("");
const assigning = ref(false);

const fullName = computed(() =>
  resident.value ? `${resident.value.firstName} ${resident.value.lastName}` : ""
);

const address = computed(() => {
  if (!resident.value) return "";
  return [resident.value.street, resident.value.city].filter(Boolean).join(", ");
});

const family = computed(() => {
  if (!resident.value) return "";
  const name = resident.value.familyName;
  const rel = resident.value.relationship;
  return rel ? `${name} (${rel})` : name;
});

const currentRoom = computed(() =>
  resident.value?.roomNumber
    ? rooms.value.find((r) => r.number === resident.value.roomNumber) ?? null
    : null
);
const roomOptions = computed(() =>
  rooms.value
    .filter((r) => !r.full)
    .map((r) => ({ value: r.id, label: `Hab. ${r.number} · ${r.occupancy}/${r.capacity}` }))
);

async function loadResident() {
  loading.value = true;
  error.value = "";
  try {
    resident.value = await getResident(residentId);
  } catch (e) {
    error.value = "No se pudo cargar el residente.";
  } finally {
    loading.value = false;
  }
}

async function loadRooms() {
  try {
    rooms.value = await getRooms();
  } catch (e) {
    rooms.value = [];
  }
}

function goBack() {
  router.push({ name: "residents" });
}

function goToEdit() {
  router.push({ name: "resident-edit", params: { id: residentId } });
}

async function handleAssign() {
  if (!selectedRoomId.value) return;
  assigning.value = true;
  assignError.value = "";
  try {
    await assignResident(selectedRoomId.value, residentId);
    await Promise.all([loadResident(), loadRooms()]); 
    selectedRoomId.value = "";
  } catch (e) {
    assignError.value =
      e.status === 409
        ? e.data?.message || "La habitación está completa."
        : "No se pudo asignar la habitación.";
  } finally {
    assigning.value = false;
  }
}

async function handleRemove() {
  if (!currentRoom.value) return;
  assigning.value = true;
  assignError.value = "";
  try {
    await removeResident(currentRoom.value.id, residentId);
    await Promise.all([loadResident(), loadRooms()]);
  } catch (e) {
    assignError.value = "No se pudo quitar de la habitación.";
  } finally {
    assigning.value = false;
  }
}

async function handleDelete() {
  if (!confirm(`¿Eliminar a ${fullName.value}? Esta acción no se puede deshacer.`)) return;
  try {
    await deleteResident(residentId);
    router.push({ name: "residents" });
  } catch (e) {
    error.value = "No se pudo eliminar el residente.";
  }
}

onMounted(() => {
  loadResident();
  loadRooms();
});

</script>
<template>
  <section class="mx-auto max-w-2xl">
    <div class="mb-4 flex items-center justify-between">
      <button class="flex items-center gap-1 text-sm text-text-muted hover:text-text" @click="goBack">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Residentes
      </button>
      <div v-if="resident" class="flex gap-2">
        <button class="rounded-lg border border-border px-3 py-1.5 text-sm text-text hover:bg-surface" @click="goToEdit">
          Editar
        </button>
        <button class="rounded-lg px-3 py-1.5 text-sm text-error hover:bg-error/10" @click="handleDelete">
          Eliminar
        </button>
      </div>
    </div>

    <p v-if="loading" class="py-10 text-center text-text-muted">Cargando…</p>
    <p v-else-if="error" class="py-10 text-center text-error">{{ error }}</p>

    <template v-else-if="resident">
      <!-- Fotografía y nombre -->
      <div class="flex flex-col items-center rounded-2xl border border-border bg-surface p-6">
        <img
          v-if="resident.photo"
          :src="resident.photo"
          :alt="fullName"
          class="h-24 w-24 rounded-full object-cover"
        />
        <div
          v-else
          class="flex h-24 w-24 items-center justify-center rounded-full bg-accent/15 text-3xl font-semibold text-accent"
        >
          {{ resident.firstName?.[0] }}{{ resident.lastName?.[0] }}
        </div>
        <h1 class="mt-4 text-xl font-bold text-navy">{{ fullName }}</h1>
      </div>

      <!-- Datos personales del residente -->
      <div class="mt-4 rounded-2xl border border-border bg-surface p-6">
        <h2 class="mb-5 text-xs font-semibold uppercase tracking-wide text-text-muted">Datos personales</h2>

        <div class="flex flex-col gap-5">
          <InfoField label="Grado de dependencia" :value="gradeLabel(resident.dependencyGrade)">
            <template #icon>
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
          </InfoField>

          <InfoField label="Edad" :value="`${resident.age} años`">
            <template #icon>
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4a4 4 0 100 8 4 4 0 000-8zM4 20a8 8 0 0116 0" />
              </svg>
            </template>
          </InfoField>

          <InfoField label="Habitación" :value="resident.roomNumber || 'Sin habitación'">
            <template #icon>
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7l9-4 9 4v10l-9 4-9-4V7z" />
              </svg>
            </template>
          </InfoField>

          <InfoField label="Domicilio anterior" :value="address">
            <template #icon>
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </template>
          </InfoField>

          <InfoField label="Familiar de referencia" :value="family">
            <template #icon>
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m7-6a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </template>
            <a
              v-if="resident.phone"
              :href="`tel:${resident.phone}`"
              class="mt-1 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11 11 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {{ resident.phone }}
            </a>
          </InfoField>
        </div>
      </div>
            <!-- Asignación de la habitación. -->
      <div class="mt-4 rounded-2xl border border-border bg-surface p-6">
        <h2 class="mb-4 text-xs font-semibold uppercase tracking-wide text-text-muted">Habitación</h2>

        <!-- Con habitación: mostrar o quitar. -->
        <div v-if="currentRoom" class="flex items-center justify-between">
          <p class="text-sm text-text">
            Asignado a <span class="font-semibold">Hab. {{ currentRoom.number }}</span>
            <span class="text-text-muted"> ({{ currentRoom.occupancy }}/{{ currentRoom.capacity }})</span>
          </p>
          <button
            class="rounded-lg px-3 py-1.5 text-sm font-medium text-error hover:bg-error/10 disabled:opacity-60"
            :disabled="assigning"
            @click="handleRemove"
          >
            Quitar
          </button>
        </div>

        <!-- Sin habitación: selector + asignar. -->
        <div v-else>
          <p v-if="roomOptions.length === 0" class="text-sm text-text-muted">
            No hay habitaciones disponibles.
          </p>
          <div v-else class="flex items-end gap-3">
            <div class="flex-1">
              <BaseSelect
                v-model="selectedRoomId"
                label="Asignar a habitación"
                :options="roomOptions"
                placeholder="Selecciona habitación…"
              />
            </div>
            <button
              class="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark disabled:opacity-60"
              :disabled="assigning || !selectedRoomId"
              @click="handleAssign"
            >
              {{ assigning ? "Asignando…" : "Asignar" }}
            </button>
          </div>
        </div>

        <p v-if="assignError" class="mt-3 text-sm text-error">{{ assignError }}</p>
      </div>
    </template>
  </section>
</template>