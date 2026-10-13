<script setup>

defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: null },
});
</script>

<template>
  <div class="flex items-start gap-3">
    <div class="mt-0.5 text-text-muted">
      <slot name="icon" />
    </div>
    <div class="min-w-0 flex-1">
      <p class="text-xs font-medium uppercase tracking-wide text-text-muted">{{ label }}</p>
      <p class="mt-0.5 text-sm font-medium text-text">{{ value || "—" }}</p>
    </div>
  </div>
</template>