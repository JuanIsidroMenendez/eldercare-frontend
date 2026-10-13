<script setup>
defineProps({
  modelValue: { type: [String, Number], default: "" },
  label: { type: String, default: "" },
  options: { type: Array, default: () => [] }, // [{ value, label }]
  placeholder: { type: String, default: "Selecciona…" },
  error: { type: String, default: "" },
});
defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <label v-if="label" class="mb-1 block text-sm font-medium text-text">{{ label }}</label>
    <select
      :value="modelValue"
      class="w-full rounded-xl border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
      :class="error ? 'border-error' : 'border-border'"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <p v-if="error" class="mt-1 text-xs text-error">{{ error }}</p>
  </div>
</template>