<script setup>
import GradeBadge from "./GradeBadge.vue";

const props = defineProps({
  resident: { type: Object, required: true },
});

const emit = defineEmits(["select"]);

function fullName(r) {
  return `${r.firstName} ${r.lastName}`;
}
// Backend ya ajustado.
function roomLabel(r) {
  return r.room?.number ? `Hab. ${r.room.number}` : "Sin habitación";
}
</script>

<template>
  <article
    class="flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-surface p-4 hover:shadow-md"
    role="button"
    @click="emit('select', resident.id)"
  >
    <img
      v-if="resident.photo"
      :src="resident.photo"
      :alt="fullName(resident)"
      class="h-14 w-14 shrink-0 rounded-full object-cover"
    />
    <div
      v-else
      class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/15 text-lg font-semibold text-accent"
    >
      {{ resident.firstName?.[0] }}{{ resident.lastName?.[0] }}
    </div>

    <div class="min-w-0 flex-1">
      <p class="truncate font-semibold text-text">{{ fullName(resident) }}</p>
      <p class="text-sm text-text-muted">{{ resident.age }} años · {{ roomLabel(resident) }}</p>
      <GradeBadge :grade="resident.dependencyGrade" class="mt-1.5" />
    </div>
  </article>
</template>