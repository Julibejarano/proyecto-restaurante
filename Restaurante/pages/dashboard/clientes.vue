<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
        <Search class="w-6 h-6" />
      </div>
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight">Historial de Clientes</h1>
        <p class="text-gray-500 font-medium mt-1">Busca el historial de pedidos y reservas de un cliente</p>
      </div>
    </div>

    <GlassCard class="p-6">
      <form @submit.prevent="searchHistorial" class="flex gap-4 mb-8">
        <div class="relative flex-1">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input v-model="searchQuery" placeholder="Nombre del cliente (Ej. Familia Jaramillo)" required class="pl-12 w-full" />
        </div>
        <Button type="submit" variant="primary" class="flex items-center gap-2" :disabled="loading">
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <Search v-else class="w-4 h-4" /> Buscar
        </Button>
      </form>

      <div v-if="hasSearched && !loading" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Reservaciones -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarCheck class="w-5 h-5 text-emerald-500" /> Reservaciones ({{ reservas.length }})
          </h2>
          <div v-if="reservas.length === 0" class="p-6 bg-gray-50 rounded-2xl text-center text-gray-500 text-sm">
            No se encontraron reservas para este cliente.
          </div>
          <div v-else class="space-y-3">
            <div v-for="r in reservas" :key="r.id" class="p-4 border border-gray-100 rounded-xl bg-white flex justify-between items-center hover:shadow-md transition-shadow">
              <div>
                <p class="font-bold text-gray-900">{{ new Date(r.fecha_hora).toLocaleString() }}</p>
                <p class="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Users class="w-4 h-4" /> {{ r.numero_personas }} personas
                </p>
              </div>
              <div class="text-right">
                <span class="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg uppercase">Mesa {{ r.mesa_numero }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pedidos -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Utensils class="w-5 h-5 text-amber-500" /> Pedidos ({{ pedidos.length }})
          </h2>
          <div v-if="pedidos.length === 0" class="p-6 bg-gray-50 rounded-2xl text-center text-gray-500 text-sm">
            No se encontraron pedidos para este cliente.
          </div>
          <div v-else class="space-y-3">
            <div v-for="p in pedidos" :key="p.id" class="p-4 border border-gray-100 rounded-xl bg-white hover:shadow-md transition-shadow">
              <div class="flex justify-between items-center mb-3">
                <p class="font-bold text-gray-900">{{ new Date(p.creado_en).toLocaleString() }}</p>
                <span :class="['px-2 py-1 text-xs font-bold rounded-md uppercase', p.estado === 'entregado' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600']">
                  {{ p.estado }} (Mesa {{ p.mesa_numero }})
                </span>
              </div>
              <ul class="space-y-1">
                <li v-for="item in p.items" :key="item.nombre" class="text-sm text-gray-600 flex justify-between">
                  <span>{{ item.cantidad }}x {{ item.nombre }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { Search, Loader2, CalendarCheck, Utensils, Users } from 'lucide-vue-next'

const searchQuery = ref('')
const loading = ref(false)
const hasSearched = ref(false)

const reservas = ref<any[]>([])
const pedidos = ref<any[]>([])

const searchHistorial = async () => {
  if (!searchQuery.value) return
  
  loading.value = true
  hasSearched.value = true
  
  try {
    const data = await $fetch(`/api/clientes/historial?cliente=${encodeURIComponent(searchQuery.value)}`)
    reservas.value = (data as any).reservas
    pedidos.value = (data as any).pedidos
  } catch (error) {
    console.error(error)
    alert("Error al buscar el historial")
  } finally {
    loading.value = false
  }
}
</script>
