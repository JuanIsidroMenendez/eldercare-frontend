<script setup>
defineProps({
  report: { type: Object, required: true },
});

function initials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <article class="flex gap-3">
    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
      {{ initials(report.author) }}
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex items-center justify-between gap-2">
        <p class="text-sm font-semibold text-text">{{ report.author }}</p>
        <p class="shrink-0 text-xs text-text-muted">{{ formatDate(report.createdAt) }}</p>
      </div>
      <div class="mt-1 rounded-xl bg-bg px-3 py-2 text-sm text-text">{{ report.content }}</div>
    </div>
  </article>
</template>