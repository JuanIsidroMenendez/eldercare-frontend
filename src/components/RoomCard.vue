<script setup>
defineProps({
  room: { type: Object, required: true },
});

const TYPE_LABELS = { INDIVIDUAL: "Individual", DOUBLE: "Doble" };
function typeLabel(type) {
  return TYPE_LABELS[type] ?? type;
}
</script>

<template>
  <article class="rounded-2xl border border-border bg-surface p-5">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-lg font-bold text-text">Hab. {{ room.number }}</p>
        <p class="text-sm text-text-muted">{{ typeLabel(room.type) }}</p>
      </div>
      <span
        class="rounded-full px-2.5 py-0.5 text-xs font-medium"
        :class="room.full ? 'bg-grade-3/15 text-grade-3' : 'bg-grade-1/15 text-grade-1'"
      >
        {{ room.full ? "Completa" : "Disponible" }}
      </span>
    </div>
    <p class="mt-3 text-sm text-text-muted">
      Ocupación:
      <span class="font-medium text-text">{{ room.occupancy }}/{{ room.capacity }}</span>
    </p>
  </article>
</template>