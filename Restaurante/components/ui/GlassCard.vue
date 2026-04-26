<template>
  <div :class="[
    'bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
    'rounded-2xl p-6 relative overflow-hidden transition-all duration-300',
    props.className
  ]">
    <!-- Borde superior sutil brillante simulando el cristal -->
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>
