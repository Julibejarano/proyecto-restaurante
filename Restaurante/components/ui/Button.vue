<template>
  <button
    :class="[
      'font-bold py-2.5 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4',
      variant === 'primary' 
        ? 'bg-gradient-to-r from-primary to-indigo-500 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 border border-primary/20 focus:ring-primary/30' 
        : variant === 'danger'
        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 border border-red-500/20 focus:ring-red-500/30'
        : variant === 'success'
        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 border border-emerald-500/20 focus:ring-emerald-500/30'
        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm focus:ring-gray-100',
      props.disabled ? 'opacity-50 cursor-not-allowed transform-none hover:shadow-none hover:-translate-y-0' : '',
      props.className
    ]"
    :disabled="props.disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  variant: {
    type: String as () => 'primary' | 'secondary' | 'danger' | 'success',
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
})
</script>
