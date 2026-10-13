<script setup>
import { computed } from "vue";

const props = defineProps({
  grade: { type: String, required: true }, // "GRADO_I" | "GRADO_II" | "GRADO_III"
});

//Las claves deben coincidir con DependencyGrade.java en back.
const gradeMeta = {
  GRADO_I: { label: "Grado I · Leve", classes: "bg-grade-1/15 text-grade-1" },
  GRADO_II: { label: "Grado II · Moderada", classes: "bg-grade-2/15 text-grade-2" },
  GRADO_III: { label: "Grado III · Severa", classes: "bg-grade-3/15 text-grade-3" },
};

const meta = computed(
  () => gradeMeta[props.grade] ?? { label: props.grade, classes: "bg-border text-text-muted" }
);
</script>

<template>
  <span class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium" :class="meta.classes">
    {{ meta.label }}
  </span>
</template>