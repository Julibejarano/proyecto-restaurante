<template>
  <div class="space-y-8 animate-in fade-in duration-500 min-h-full">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
        <MonitorPlay class="w-6 h-6" />
      </div>
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight">KDS Cocina</h1>
        <p class="text-gray-500 font-medium mt-1">
          Monitor de preparación de pedidos 
          <span v-if="auth.user.value?.especialidad" class="text-primary font-bold uppercase text-xs ml-2 px-2 py-0.5 bg-primary/10 rounded-full">
            {{ auth.user.value?.especialidad.replace('_', ' ') }}
          </span>
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <GlassCard v-for="pedido in pedidosCocina" :key="pedido.id" class="!p-0 h-full flex flex-col border-2 border-red-500 shadow-red-500/10 overflow-hidden relative">
        <div class="h-2 bg-gradient-to-r from-red-500 to-rose-500 w-full animate-pulse" />
        
        <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-red-50/30">
          <div>
            <h3 class="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Mesa</h3>
            <p class="text-3xl font-black text-gray-900 leading-none">#{{ pedido.mesa_numero ?? pedido.mesa_id }}</p>
          </div>
          <div class="text-right">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-red-200 text-red-600 text-xs font-bold shadow-sm">
              <Clock class="w-3.5 h-3.5" /> {{ new Date(pedido.creado_en ?? Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
            </span>
          </div>
        </div>
        
        <div class="p-5 flex-1 flex flex-col bg-white">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <ChefHat class="w-4 h-4" /> Ítems a cocinar
          </p>
          <ul class="space-y-3 flex-1">
            <li v-for="item in pedido.items" :key="item?.id ?? Math.random()" class="flex gap-3 text-gray-900 font-bold text-base items-center pb-3 border-b border-gray-50 last:border-0 justify-between">
              <div class="flex items-center gap-3">
                <span class="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span class="leading-tight">{{ item.cantidad }}x {{ item.nombre ?? 'Ítem' }}</span>
              </div>
              <button 
                @click="markItemReady(item.id)"
                class="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-green-500 hover:text-white transition-all shadow-sm hover:shadow-green-500/30 group"
                title="Marcar ítem como listo"
              >
                <CheckCircle2 class="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </li>
          </ul>
        </div>
      </GlassCard>

      <div v-if="pedidosCocina.length === 0" class="col-span-full flex flex-col items-center justify-center py-32 text-gray-400 bg-white/50 backdrop-blur-xl rounded-3xl border border-dashed border-gray-300">
        <PartyPopper class="w-20 h-20 text-gray-300 mb-6" />
        <h2 class="text-2xl font-black text-gray-900 mb-2">¡Cocina Limpia!</h2>
        <p class="text-lg">No hay pedidos pendientes de tu especialidad.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MonitorPlay, Clock, ChefHat, CheckCircle2, PartyPopper } from 'lucide-vue-next'

const auth = useAuth()
const pedidos = ref<any[]>([])

const pedidosCocina = computed(() => {
  const especialidad = auth.user.value?.especialidad
  return pedidos.value
    .map(p => {
      // Filtrar items por especialidad y que estén en preparación
      const filteredItems = p.items.filter((item: any) => {
        const matchesSpec = especialidad ? item.categoria === especialidad : true
        const isPrep = item.estado === 'en_preparacion'
        return matchesSpec && isPrep
      })
      return { ...p, items: filteredItems }
    })
    .filter(p => p.items.length > 0) // Solo mostrar pedidos con items pendientes de mi especialidad
})

const refreshData = async () => {
  pedidos.value = await $fetch('/api/pedidos') as any[]
}

let intervalId: any;

onMounted(() => {
  refreshData()
  intervalId = setInterval(refreshData, 5000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

const markItemReady = async (itemId: number) => {
  try {
    // Si no tiene id, no podemos actualizarlo (pasa a veces con datos mockeados mal, pero aquí todos tienen)
    if (!itemId) return;
    
    await $fetch(`/api/pedidos/items/${itemId}`, { method: 'PUT', body: { estado: 'listo' } })
    refreshData()
  } catch (error) {
    console.error("Error updating item", error)
  }
}
</script>
