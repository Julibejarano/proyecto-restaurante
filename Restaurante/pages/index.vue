<script setup>
const auth = useAuth()
const { user } = auth

if (process.client) {
  if (!user.value) {
    navigateTo('/login')
  } else {
    navigateTo('/dashboard')
  }
}
</script>

<template>
  <div class="centered">
    <p>Cargando...</p>
  </div>
</template>
