<template>
  <div class="space-y-8 animate-in fade-in duration-500 relative">
    <div class="flex justify-between items-center flex-wrap gap-4">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
          <ClipboardList class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">Gestión de Pedidos</h1>
          <p class="text-gray-500 font-medium mt-1">Toma de pedidos y despachos a mesas</p>
        </div>
      </div>
      <Button variant="primary" class="flex items-center gap-2" @click="showModal = true">
        <Plus class="w-5 h-5" /> Nuevo Pedido
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <GlassCard v-for="pedido in activePedidos" :key="pedido.id" :class="['!p-0 overflow-hidden flex flex-col', pedido.estado === 'listo' ? 'border-2 border-green-400 shadow-green-500/10' : 'border-2 border-amber-400 shadow-amber-500/10']">
        <div :class="['px-5 py-3 flex justify-between items-center', pedido.estado === 'listo' ? 'bg-green-500' : 'bg-amber-400']">
          <span class="text-xs font-black tracking-widest uppercase flex items-center gap-2 text-white">
            <component :is="pedido.estado === 'listo' ? CheckCircle2 : Clock" class="w-4 h-4" />
            {{ pedido.estado === 'listo' ? 'LISTO PARA ENTREGAR' : 'EN PREPARACIÓN' }}
          </span>
        </div>
        
        <div class="p-5 flex-1 flex flex-col">
          <div class="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
            <div>
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mesa</h3>
              <p class="text-3xl font-black text-gray-900 leading-none">#{{ pedido.mesa_numero ?? pedido.mesa_id }}</p>
            </div>
            <div class="text-right">
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Cliente</h3>
              <p class="text-lg font-bold text-gray-700 leading-none">{{ pedido.cliente || 'Anónimo' }}</p>
            </div>
          </div>
          
          <div class="flex-1">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Utensils class="w-3.5 h-3.5" /> Ítems del Pedido</p>
            <ul class="space-y-2">
              <li v-for="item in pedido.items" :key="item?.id ?? Math.random()" class="flex items-start gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                <span class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>{{ item.nombre ?? 'Ítem' }}</span>
              </li>
            </ul>
            <p v-if="!pedido.items || pedido.items.length === 0" class="text-sm text-gray-400 italic mt-2">Sin ítems registrados.</p>
          </div>

          <div class="mt-6 pt-4">
            <Button 
              v-if="pedido.estado === 'listo'"
              variant="success"
              class="w-full flex items-center justify-center gap-2 text-lg py-3" 
              @click="markAsDelivered(pedido.id)"
            >
              <Check class="w-5 h-5" /> Marcar como Entregado
            </Button>
            <div v-else class="w-full text-center py-3 px-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 font-bold text-sm flex items-center justify-center gap-2">
              <Loader2 class="w-4 h-4 animate-spin" /> Esperando a cocina...
            </div>
          </div>
        </div>
      </GlassCard>

      <div v-if="activePedidos.length === 0" class="col-span-full flex flex-col items-center justify-center py-20 text-gray-500 bg-white/50 backdrop-blur-xl rounded-3xl border border-dashed border-gray-300">
        <Coffee class="w-16 h-16 text-gray-300 mb-4" />
        <p class="text-lg font-bold text-gray-900">No hay pedidos activos</p>
        <p class="text-sm">Todos los clientes han sido atendidos.</p>
      </div>
    </div>

    <!-- Modal Nuevo Pedido -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      <GlassCard class="w-full max-w-3xl max-h-[90vh] flex flex-col !p-0 shadow-2xl">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2"><UtensilsCrossed class="w-5 h-5 text-primary" /> Crear Nuevo Pedido</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 p-2"><X class="w-5 h-5" /></button>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1 bg-gray-50/50">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Mesa</label>
              <select v-model="newPedido.mesa_id" class="w-full p-3.5 rounded-xl border border-gray-200 text-gray-900 bg-white focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all">
                <option value="0" disabled>Selecciona una mesa</option>
                <option v-for="m in mesas" :key="m.id" :value="m.id">Mesa #{{ m.numero }} (Capacidad: {{ m.capacidad }})</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre del Cliente <span class="text-gray-400 font-normal lowercase">(Opcional)</span></label>
              <Input v-model="newPedido.cliente" type="text" placeholder="Ej. Familia Rodríguez" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Menú Disponible</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button 
                v-for="item in menuItems" :key="item.id"
                @click="toggleItem(item.id)"
                :class="[
                  'p-4 text-left border rounded-xl transition-all duration-200 flex flex-col justify-between h-full group',
                  newPedido.items.includes(item.id) 
                    ? 'bg-primary/5 border-primary shadow-[0_0_0_1px_rgba(79,70,229,1)]' 
                    : 'bg-white border-gray-200 hover:border-primary/50 hover:shadow-md'
                ]"
              >
                <div>
                  <span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wider mb-2 inline-block">{{ item.categoria }}</span>
                  <p class="font-bold text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors">{{ item.nombre }}</p>
                </div>
                <div class="flex justify-between items-end mt-4 w-full">
                  <span class="text-xs font-semibold text-gray-400"><Clock class="w-3 h-3 inline pb-0.5" /> {{ item.tiempo_preparacion }}m</span>
                  <span class="text-lg font-black text-primary">${{ item.precio }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-100 bg-white flex justify-between items-center">
          <p class="text-sm font-bold text-gray-500"><span class="text-primary">{{ newPedido.items.length }}</span> ítems seleccionados</p>
          <div class="flex gap-3">
            <Button variant="secondary" @click="showModal = false">Cancelar</Button>
            <Button variant="primary" @click="handleCreatePedido" :disabled="isSubmitting || newPedido.items.length === 0 || newPedido.mesa_id === 0" class="flex items-center gap-2">
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <Send v-else class="w-4 h-4" />
              {{ isSubmitting ? 'Enviando...' : 'Enviar a Cocina' }}
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
    <!-- Notificaciones Flotantes -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <TransitionGroup name="list">
        <div v-for="notif in notifications" :key="notif.id" class="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-green-400">
          <BellRing class="w-5 h-5 animate-bounce" />
          <div>
            <p class="font-bold text-sm">¡Pedido Listo!</p>
            <p class="text-xs opacity-90">{{ notif.message }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style>
.list-enter-active, .list-leave-active { transition: all 0.5s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(30px); }
</style>

<script setup lang="ts">
import { ClipboardList, Plus, CheckCircle2, Clock, Check, Utensils, Loader2, Coffee, UtensilsCrossed, X, Send, BellRing } from 'lucide-vue-next'

const pedidos = ref<any[]>([])
const mesas = ref<any[]>([])
const menuItems = ref<any[]>([])
const showModal = ref(false)
const isSubmitting = ref(false)

const newPedido = ref({ mesa_id: 0, cliente: '', items: [] as number[] })

const activePedidos = computed(() => pedidos.value.filter(p => p.estado !== 'entregado'))

const notifications = ref<any[]>([])
let previousListos = new Set()
let intervalId: any;

const refreshData = async () => {
  try {
    const [pRes, mRes, menuRes] = await Promise.all([
      $fetch('/api/pedidos'),
      $fetch('/api/reportes/ocupacion'),
      $fetch('/api/menu')
    ])
    pedidos.value = pRes as any[] || []
    mesas.value = (mRes as any)?.mesas?.filter((m: any) => m.ocupada) || []
    menuItems.value = menuRes as any[] || []
    
    // Lógica de notificaciones
    const currentListos = new Set(pedidos.value.filter(p => p.estado === 'listo').map(p => p.id))
    for (const id of currentListos) {
      if (!previousListos.has(id)) {
        const pedido = pedidos.value.find(p => p.id === id)
        const nId = Date.now() + Math.random()
        notifications.value.push({ id: nId, message: `Mesa #${pedido?.mesa_numero ?? pedido?.mesa_id} está lista para entregar.` })
        setTimeout(() => { notifications.value = notifications.value.filter(n => n.id !== nId) }, 6000)
      }
    }
    previousListos = currentListos
  } catch (error) {
    console.error("Error cargando datos del mesero:", error)
  }
}

onMounted(() => {
  refreshData()
  intervalId = setInterval(refreshData, 5000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

const toggleItem = (itemId: number) => {
  const index = newPedido.value.items.indexOf(itemId)
  if (index > -1) {
    newPedido.value.items.splice(index, 1)
  } else {
    newPedido.value.items.push(itemId)
  }
}

const handleCreatePedido = async () => {
  if (!newPedido.value.mesa_id || newPedido.value.items.length === 0) return alert("Selecciona una mesa y al menos un ítem")
  isSubmitting.value = true
  try {
    await $fetch('/api/pedidos', { method: 'POST', body: newPedido.value })
    showModal.value = false
    newPedido.value = { mesa_id: 0, cliente: '', items: [] }
    await refreshData()
  } catch (error) {
    console.error(error)
    alert("Error al crear el pedido")
  } finally {
    isSubmitting.value = false
  }
}

const markAsDelivered = async (id: number) => {
  try {
    await $fetch(`/api/pedidos/${id}`, { method: 'PUT', body: { estado: 'entregado' } })
    refreshData()
  } catch (error) {
    console.error("Error updating pedido", error)
  }
}
</script>
