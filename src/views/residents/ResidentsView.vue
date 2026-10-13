<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getResidents } from "../../services/residentService.js";
import ResidentCard from "../../components/ResidentCard.vue"; // AÑADIDO

const router = useRouter();

const residents = ref([]);
const loading = ref(true);
const error = ref("");

const searchTerm = ref("");
const activeGrade = ref("TODOS");

const gradeFilters = [
  { value: "TODOS", label: "Todos" },
  { value: "GRADO_I", label: "Grado I" },
  { value: "GRADO_II", label: "Grado II" },
  { value: "GRADO_III", label: "Grado III" },
];

const filteredResidents = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  return residents.value.filter((r) => {
    const matchesGrade = activeGrade.value === "TODOS" || r.dependencyGrade === activeGrade.value;
    const matchesSearch = `${r.firstName} ${r.lastName}`.toLowerCase().includes(term);
    return matchesGrade && matchesSearch;
  });
});

async function loadResidents() {
  loading.value = true;
  error.value = "";
  try {
    residents.value = await getResidents();
  } catch (e) {
    error.value = "No se pudieron cargar los residentes.";
  } finally {
    loading.value = false;
  }
}

function goToNew() {
  router.push({ name: "resident-new" });
}

function goToDetail(id) {
  router.push({ name: "resident-detail", params: { id } });
}

onMounted(loadResidents);
</script>

<template>
  <section>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-text">Residentes</h1>
      <button
        class="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark"
        @click="goToNew"
      >
        + Nuevo residente
      </button>
    </div>

    <div class="mb-4">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Buscar residente…"
        class="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
      />
    </div>

    <div class="mb-6 flex flex-wrap gap-2">
      <button
        v-for="chip in gradeFilters"
        :key="chip.value"
        class="rounded-full px-4 py-1.5 text-sm font-medium transition"
        :class="activeGrade === chip.value
          ? 'bg-navy text-white'
          : 'bg-surface text-text-muted border border-border hover:bg-bg'"
        @click="activeGrade = chip.value"
      >
        {{ chip.label }}
      </button>
    </div>

    <p v-if="loading" class="py-10 text-center text-text-muted">Cargando residentes…</p>
    <p v-else-if="error" class="py-10 text-center text-error">{{ error }}</p>
    <p v-else-if="filteredResidents.length === 0" class="py-10 text-center text-text-muted">
      No hay residentes que coincidan.
    </p>

    <!-- CAMBIADO: el <article> inline se sustituye por <ResidentCard> -->
    <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <ResidentCard
        v-for="r in filteredResidents"
        :key="r.id"
        :resident="r"
        @select="goToDetail"
      />
    </div>
  </section>
</template>