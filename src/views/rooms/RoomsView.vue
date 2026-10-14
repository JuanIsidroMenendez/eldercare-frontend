<script setup>
import { ref, onMounted } from "vue";
import { getRooms } from "../../services/roomService";
import RoomCard from "../../components/RoomCard.vue";

const rooms = ref([]);
const loading = ref(true);
const error = ref("");

async function loadRooms() {
  loading.value = true;
  error.value = "";
  try {
    rooms.value = await getRooms();
  } catch (e) {
    error.value = "No se pudieron cargar las habitaciones.";
  } finally {
    loading.value = false;
  }
}

onMounted(loadRooms);
</script>

<template>
  <section>
    <h1 class="mb-6 text-2xl font-bold text-text">Habitaciones</h1>

    <p v-if="loading" class="py-10 text-center text-text-muted">Cargando habitaciones…</p>
    <p v-else-if="error" class="py-10 text-center text-error">{{ error }}</p>
    <p v-else-if="rooms.length === 0" class="py-10 text-center text-text-muted">
      No hay habitaciones registradas.
    </p>

    <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <RoomCard v-for="r in rooms" :key="r.id" :room="r" />
    </div>
  </section>
</template>