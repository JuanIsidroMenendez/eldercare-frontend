<script setup>
// La etiqueta y el color se refactorizan a grade.js.
import { gradeLabel, gradeClasses } from "../utils/grade";

defineProps({
  grade: { type: String, required: true },
});
</script>

<template>
  <span
    class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
    :class="gradeClasses(grade)"
  >
    {{ gradeLabel(grade) }}
  </span>
</template>