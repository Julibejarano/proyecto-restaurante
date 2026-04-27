<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
          <Settings class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">Panel Administrativo</h1>
          <p class="text-gray-500 font-medium mt-1">Configuración general del restaurante</p>
        </div>
      </div>
      
      <div class="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
        <div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Ocupación en Vivo</p>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-black" :class="ocupacionInfo.porcentaje >= 80 ? 'text-red-500' : 'text-primary'">{{ ocupacionInfo.ocupacion_actual }}</span>
            <span class="text-gray-500 font-medium">/ {{ ocupacionInfo.capacidad_total }} Personas</span>
          </div>
        </div>
        <div class="w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-1000" 
               :class="ocupacionInfo.porcentaje >= 80 ? 'bg-red-500' : (ocupacionInfo.porcentaje >= 50 ? 'bg-orange-400' : 'bg-primary')"
               :style="{ width: ocupacionInfo.porcentaje + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <!-- Mesas -->
      <GlassCard class="flex flex-col h-full">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <LayoutGrid class="w-4 h-4" />
          </div>
          <h2 class="text-xl font-bold text-gray-900">Gestión de Mesas</h2>
        </div>
        
        <form @submit.prevent="createMesa" class="flex gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <Input v-model.number="newMesa.numero" type="number" placeholder="Número" required class="flex-1" />
          <Input v-model.number="newMesa.capacidad" type="number" placeholder="Capacidad" required class="flex-1" />
          <Button type="submit" variant="primary" class="whitespace-nowrap flex items-center gap-2">
            <Plus class="w-4 h-4" /> Agregar
          </Button>
        </form>

        <div class="flex-1 overflow-y-auto pr-2 space-y-3">
          <div v-for="mesa in mesas" :key="mesa.id" class="group flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl hover:border-primary/30 hover:shadow-md transition-all">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 font-bold">#{{ mesa.numero }}</div>
              <div>
                <p class="font-bold text-gray-900">Mesa Principal</p>
                <p class="text-sm text-gray-500 font-medium">{{ mesa.capacidad }} Personas max.</p>
              </div>
            </div>
            <button @click="removeMesa(mesa.id)" class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      <!-- Empleados -->
      <GlassCard class="flex flex-col h-full">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users class="w-4 h-4" />
          </div>
          <h2 class="text-xl font-bold text-gray-900">Empleados</h2>
        </div>

        <form @submit.prevent="createEmployee" class="grid grid-cols-2 gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <Input v-model="newEmployee.username" placeholder="Usuario" required />
          <Input v-model="newEmployee.name" placeholder="Nombre completo" required />
          <Input v-model="newEmployee.password" type="password" placeholder="Contraseña" required />
          <select v-model="newEmployee.role" required class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-4 focus:ring-primary/15 focus:border-primary">
            <option disabled value="">Seleccionar Rol</option>
            <option value="maitre">Maitre</option>
            <option value="mesero">Mesero</option>
            <option value="cocinero">Cocinero</option>
          </select>
          <select v-if="newEmployee.role === 'cocinero'" v-model="newEmployee.especialidad" required class="col-span-2 w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-4 focus:ring-primary/15 focus:border-primary">
            <option disabled value="">Seleccionar Especialidad</option>
            <option value="entrada">Entradas</option>
            <option value="plato_fuerte">Platos Fuertes</option>
            <option value="bebida">Bebidas</option>
            <option value="postre">Postres</option>
          </select>
          <Button type="submit" variant="success" class="col-span-2 flex justify-center items-center gap-2">
            <UserPlus class="w-4 h-4" /> Registrar Empleado
          </Button>
        </form>

        <div class="flex-1 overflow-y-auto pr-2 space-y-3">
          <div v-for="emp in employees" :key="emp.id" class="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl">
            <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold uppercase">{{ emp.name.charAt(0) }}</div>
            <div class="flex-1">
              <p class="font-bold text-gray-900">{{ emp.name }}</p>
              <p class="text-sm text-gray-500">@{{ emp.username }}</p>
            </div>
            <span class="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">
              {{ emp.role }}
            </span>
          </div>
        </div>
      </GlassCard>

      <!-- Menú -->
      <GlassCard class="xl:col-span-2">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <Coffee class="w-4 h-4" />
          </div>
          <h2 class="text-xl font-bold text-gray-900">Gestión del Menú</h2>
        </div>

        <form @submit.prevent="createMenuItem" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <Input v-model="newMenuItem.nombre" placeholder="Nombre del plato" required class="md:col-span-2" />
          <Input v-model.number="newMenuItem.precio" type="number" placeholder="Precio ($)" step="0.01" required />
          <select v-model="newMenuItem.categoria" required class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-4 focus:ring-primary/15 focus:border-primary">
            <option disabled value="">Categoría</option>
            <option value="entrada">Entrada</option>
            <option value="plato_fuerte">Plato Fuerte</option>
            <option value="postre">Postre</option>
            <option value="bebida">Bebida</option>
          </select>
          <Input v-model.number="newMenuItem.tiempo_preparacion" type="number" placeholder="Tiempo preparación (min)" required class="md:col-span-2" />
          <Input v-model="newMenuItem.descripcion" placeholder="Descripción breve" class="md:col-span-2" />
          <Button type="submit" variant="primary" class="md:col-span-4 flex justify-center items-center gap-2">
            <Plus class="w-4 h-4" /> Añadir Plato al Menú
          </Button>
        </form>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="item in menu" :key="item.id" class="group bg-white border border-gray-100 p-5 rounded-2xl hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md uppercase tracking-wider">{{ item.categoria }}</span>
                <span class="text-lg font-black text-primary">${{ item.precio }}</span>
              </div>
              <h3 class="font-bold text-gray-900 text-lg leading-tight mb-1">{{ item.nombre }}</h3>
              <p class="text-sm text-gray-500 line-clamp-2">{{ item.descripcion || 'Sin descripción' }}</p>
            </div>
            <div class="mt-6 flex items-center justify-between">
              <span class="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <Clock class="w-3 h-3" /> {{ item.tiempo_preparacion }} min
              </span>
              <button @click="deleteMenuItem(item.id)" class="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Settings, LayoutGrid, Plus, Trash2, Users, UserPlus, Coffee, Clock } from 'lucide-vue-next'

const mesas = ref<any[]>([])
const menu = ref<any[]>([])
const employees = ref<any[]>([])

const newMesa = ref({ numero: '', capacidad: '' })
const newMenuItem = ref({ nombre: '', descripcion: '', precio: '', tiempo_preparacion: '', categoria: '' })
const newEmployee = ref({ username: '', name: '', password: '', role: '', especialidad: '' })

const ocupacionInfo = ref({ ocupacion_actual: 0, capacidad_total: 50, porcentaje: 0 })

const refreshData = async () => {
  const ocu = await $fetch('/api/reportes/ocupacion') as any
  mesas.value = ocu.mesas
  ocupacionInfo.value = {
    ocupacion_actual: ocu.ocupacion_actual,
    capacidad_total: ocu.capacidad_total,
    porcentaje: ocu.porcentaje
  }
  menu.value = await $fetch('/api/menu')
  employees.value = await $fetch('/api/users')
}

onMounted(refreshData)

const createMesa = async () => {
  await $fetch('/api/mesas', { method: 'POST', body: newMesa.value })
  newMesa.value = { numero: '', capacidad: '' }
  refreshData()
}
const removeMesa = async (id: number) => {
  await $fetch(`/api/mesas/${id}`, { method: 'DELETE' })
  refreshData()
}

const createEmployee = async () => {
  await $fetch('/api/auth/register', { method: 'POST', body: newEmployee.value })
  newEmployee.value = { username: '', name: '', password: '', role: '', especialidad: '' }
  refreshData()
}

const createMenuItem = async () => {
  await $fetch('/api/menu', { method: 'POST', body: newMenuItem.value })
  newMenuItem.value = { nombre: '', descripcion: '', precio: '', tiempo_preparacion: '', categoria: '' }
  refreshData()
}
const deleteMenuItem = async (id: number) => {
  await $fetch(`/api/menu/${id}`, { method: 'DELETE' })
  refreshData()
}
</script>
