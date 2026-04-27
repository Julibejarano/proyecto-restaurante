<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
        <CalendarCheck class="w-6 h-6" />
      </div>
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight">Gestión de Reservaciones</h1>
        <p class="text-gray-500 font-medium mt-1">Control de cupos, fechas y mesas del restaurante</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Sección Reservas -->
      <div class="lg:col-span-2 space-y-6">
        <GlassCard>
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarPlus class="w-4 h-4" />
            </div>
            <h2 class="text-xl font-bold text-gray-900">{{ editingReservaId ? 'Editar Reserva' : 'Nueva Reserva' }}</h2>
          </div>
          
          <form @submit.prevent="saveReserva" class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <Input v-model="newReserva.cliente" placeholder="Nombre del cliente" required class="md:col-span-2" />
            <select v-model.number="newReserva.mesa_id" required class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-4 focus:ring-primary/15 focus:border-primary">
              <option disabled value="0">Seleccionar Mesa</option>
              <option v-for="mesa in mesasFiltradas" :key="mesa.id" :value="mesa.id">Mesa #{{ mesa.numero }} ({{ mesa.capacidad }} px)</option>
            </select>
            <Input v-model.number="newReserva.numero_personas" type="number" placeholder="Personas" min="1" required />
            <Input v-model="newReserva.fecha_hora" type="datetime-local" required class="md:col-span-2" />
            <div class="md:col-span-2 flex gap-3">
              <Button type="submit" variant="primary" class="flex-1 flex items-center justify-center gap-2">
                <Plus v-if="!editingReservaId" class="w-4 h-4" />
                <Pencil v-else class="w-4 h-4" />
                {{ editingReservaId ? 'Guardar Cambios' : 'Registrar Reserva' }}
              </Button>
              <Button v-if="editingReservaId" type="button" @click="cancelEditReserva" class="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 px-6 rounded-xl font-bold transition-colors">
                Cancelar
              </Button>
            </div>
          </form>
        </GlassCard>

        <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2 mt-8 mb-4">
          <ListTodo class="w-5 h-5 text-primary" /> Próximas Reservas
        </h3>

        <div v-if="reservas.length === 0" class="flex flex-col items-center justify-center py-16 bg-white/50 rounded-3xl border border-dashed border-gray-200">
          <CalendarX class="w-12 h-12 text-gray-300 mb-3" />
          <p class="text-gray-500 font-medium">No hay reservas programadas por ahora.</p>
        </div>

        <div class="space-y-4">
          <GlassCard v-for="reserva in reservas" :key="reserva.id" class="!p-5 flex flex-col md:flex-row md:items-center justify-between border-l-4 border-l-primary hover:border-l-indigo-500 transition-colors group">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                {{ reserva.cliente.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">{{ reserva.cliente }}</h3>
                <div class="flex items-center gap-4 text-sm font-medium text-gray-500 mt-1">
                  <span class="flex items-center gap-1.5"><Calendar class="w-3.5 h-3.5" /> {{ new Date(reserva.fecha_hora).toLocaleString() }}</span>
                  <span class="flex items-center gap-1.5"><Users class="w-3.5 h-3.5" /> {{ reserva.numero_personas }} personas</span>
                </div>
              </div>
            </div>
            <div class="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
              <div class="text-center md:text-right">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mesa Asignada</p>
                <p class="text-2xl font-black text-primary">#{{ reserva.mesa_numero ?? reserva.mesa_id }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button @click="editReserva(reserva)" class="w-10 h-10 flex items-center justify-center rounded-xl text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors bg-gray-50 md:bg-transparent">
                  <Pencil class="w-5 h-5" />
                </button>
                <button @click="deleteReserva(reserva.id)" class="w-10 h-10 flex items-center justify-center rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors bg-gray-50 md:bg-transparent">
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <!-- Mapa de Mesas -->
      <div>
        <div class="sticky top-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <LayoutGrid class="w-4 h-4" />
            </div>
            <h2 class="text-xl font-bold text-gray-900">Estado de Mesas</h2>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <GlassCard v-for="mesa in mesas" :key="mesa.id" 
              :class="[
                'text-center !p-6 flex flex-col items-center justify-center cursor-default transition-all duration-300',
                mesa.ocupada ? 'bg-red-50/80 border-red-200 shadow-red-500/10' : 'hover:bg-emerald-50/50 hover:border-emerald-200 group'
              ]">
              <div :class="[
                'w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors',
                mesa.ocupada ? 'bg-red-100 text-red-700' : 'bg-gray-50 group-hover:bg-emerald-100'
              ]">
                <span :class="['text-2xl font-black', mesa.ocupada ? 'text-red-700' : 'text-gray-900 group-hover:text-emerald-700']">{{ mesa.numero }}</span>
              </div>
              <span :class="['text-xs font-bold uppercase tracking-wider flex items-center gap-1.5', mesa.ocupada ? 'text-red-500' : 'text-gray-500 group-hover:text-emerald-600']">
                <Users class="w-3.5 h-3.5" /> {{ mesa.capacidad }} Px
              </span>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
    <!-- Notificaciones Flotantes -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <TransitionGroup name="list">
        <div v-for="notif in notifications" :key="notif.id" class="bg-indigo-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-indigo-400">
          <BellRing class="w-5 h-5 animate-bounce" />
          <div>
            <p class="font-bold text-sm">¡Próxima Reserva!</p>
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
import { CalendarCheck, CalendarPlus, ListTodo, CalendarX, Calendar, Users, Trash2, LayoutGrid, Plus, BellRing, Pencil } from 'lucide-vue-next'

const mesas = ref<any[]>([])
const reservas = ref<any[]>([])
const newReserva = ref({ cliente: '', mesa_id: 0, fecha_hora: '', numero_personas: 1 })
const editingReservaId = ref<number | null>(null)

const mesasFiltradas = computed(() => {
  const personas = newReserva.value.numero_personas || 1
  const mesasQueCaben = mesas.value.filter(m => m.capacidad >= personas)
  if (mesasQueCaben.length === 0) return []
  
  const minCap = Math.min(...mesasQueCaben.map(m => Number(m.capacidad)))
  return mesasQueCaben.filter(m => Number(m.capacidad) === minCap)
})

const notifications = ref<any[]>([])
let previousAlerts = new Set()
let intervalId: any;

const refreshData = async () => {
  const ocu = await $fetch('/api/reportes/ocupacion') as any
  mesas.value = ocu.mesas
  reservas.value = await $fetch('/api/reservas')
  
  // Notificaciones de reservas próximas (30 min)
  const now = new Date().getTime()
  const thirtyMins = 30 * 60 * 1000
  for (const res of reservas.value) {
    const resTime = new Date(res.fecha_hora).getTime()
    const diff = resTime - now
    if (diff > 0 && diff <= thirtyMins && !previousAlerts.has(res.id)) {
      previousAlerts.add(res.id)
      const nId = Date.now() + Math.random()
      notifications.value.push({ id: nId, message: `Reserva de ${res.cliente} (Mesa ${res.mesa_numero ?? res.mesa_id}) comienza pronto.` })
      setTimeout(() => { notifications.value = notifications.value.filter(n => n.id !== nId) }, 8000)
    }
  }
}

onMounted(() => {
  refreshData()
  intervalId = setInterval(refreshData, 10000) // cada 10s
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

const saveReserva = async () => {
  try {
    if (editingReservaId.value) {
      await $fetch(`/api/reservas/${editingReservaId.value}`, { method: 'PUT', body: newReserva.value })
      editingReservaId.value = null
    } else {
      await $fetch('/api/reservas', { method: 'POST', body: newReserva.value })
    }
    newReserva.value = { cliente: '', mesa_id: 0, fecha_hora: '', numero_personas: 1 }
    refreshData()
  } catch (err: any) {
    alert(err.statusMessage || "Error al guardar reservación")
  }
}

const editReserva = (res: any) => {
  editingReservaId.value = res.id
  const d = new Date(res.fecha_hora)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  newReserva.value = {
    cliente: res.cliente,
    mesa_id: res.mesa_id,
    fecha_hora: d.toISOString().slice(0, 16),
    numero_personas: res.numero_personas
  }
}

const cancelEditReserva = () => {
  editingReservaId.value = null
  newReserva.value = { cliente: '', mesa_id: 0, fecha_hora: '', numero_personas: 1 }
}

const deleteReserva = async (id: number) => {
  await $fetch(`/api/reservas/${id}`, { method: 'DELETE' })
  refreshData()
}
</script>
