<script setup>
defineProps({
  modelValue: { type: String, default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  rows: { type: Number, default: 3 },
  error: { type: String, default: "" },
});
defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <label v-if="label" class="mb-1 block text-sm font-medium text-text">{{ label }}</label>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      class="w-full resize-y rounded-xl border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
      :class="error ? 'border-error' : 'border-border'"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    <p v-if="error" class="mt-1 text-xs text-error">{{ error }}</p>
  </div>
</template>