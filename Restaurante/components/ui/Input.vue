<template>
  <input
    v-bind="$attrs"
    v-model="model"
    :class="[
      'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400',
      'shadow-sm shadow-black/5',
      'focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all duration-300',
      props.className
    ]"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  className: {
    type: String,
    default: ''
  }
})

const model = defineModel<string | number>()
</script>
