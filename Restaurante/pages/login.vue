<template>
  <div class="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
    <!-- Glowing orbs in background -->
    <div class="absolute top-[20%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
    <div class="absolute bottom-[20%] right-[20%] w-[25vw] h-[25vw] rounded-full bg-purple-500/20 blur-[100px] pointer-events-none" />

    <GlassCard className="w-full max-w-md relative z-10 border border-white/20">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-foreground tracking-tight">Bienvenido</h1>
        <p class="text-gray-600 mt-2">Ingresa a tu cuenta para continuar</p>
      </div>

      <form @submit.prevent="submit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Usuario</label>
          <Input v-model="username" type="text" required autocomplete="username" placeholder="Ingresa tu usuario" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Contraseña</label>
          <Input v-model="password" type="password" required autocomplete="current-password" placeholder="••••••••" />
        </div>

        <p class="text-red-500 text-sm font-medium text-center" v-if="error">{{ error }}</p>

        <Button type="submit" class="w-full mt-4" :disabled="isLoading">
          {{ isLoading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </Button>
      </form>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">







definePageMeta({ layout: false })

const router = useRouter()
const username = ref('admin')
const password = ref('admin123')
const error = ref('')
const isLoading = ref(false)
const auth = useAuth()

const submit = async () => {
  error.value = ''
  isLoading.value = true
  const response = await $fetch('/api/auth/login', {
    method: 'POST',
    body: { username: username.value, password: password.value },
  }).catch((err: any) => {
    error.value = err?.data?.message || 'Credenciales incorrectas'
  }).finally(() => { isLoading.value = false })

  if (response?.user) {
    auth.user.value = response.user
    
    // Redirect based on role
    if (response.user.role === 'admin') router.push('/dashboard/admin')
    else if (response.user.role === 'maitre') router.push('/dashboard/maitre')
    else if (response.user.role === 'mesero') router.push('/dashboard/mesero')
    else router.push('/dashboard/cocinero')
  }
}
</script>
