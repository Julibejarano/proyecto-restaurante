<template>
  <div class="flex items-center justify-center h-full">
    <p class="text-gray-500">Redirigiendo...</p>
  </div>
</template>

<script setup lang="ts">




const auth = useAuth()
const router = useRouter()

onMounted(async () => {
  await auth.fetchUser()
  if (auth.user.value) {
    const role = auth.user.value.role
    if (role === 'admin') router.push('/dashboard/admin')
    else if (role === 'maitre') router.push('/dashboard/maitre')
    else if (role === 'mesero') router.push('/dashboard/mesero')
    else router.push('/dashboard/cocinero')
  } else {
    router.push('/login')
  }
})
</script>
