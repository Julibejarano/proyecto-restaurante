<template>
  <div class="flex h-screen bg-[#f8fafc] overflow-hidden">
    <!-- Sidebar Premium -->
    <aside class="w-72 bg-white/60 backdrop-blur-3xl border-r border-white/80 flex flex-col shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 relative">
      <div class="p-8">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <UtensilsCrossed class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-xl font-black text-gray-900 tracking-tight">Restaurante</h2>
            <p class="text-xs font-semibold text-primary uppercase tracking-wider mt-0.5">{{ user?.role }}</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 px-4 space-y-1.5 mt-2">
        <NuxtLink
          v-for="item in visibleItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 group"
          :class="$route.path.startsWith(item.path) 
            ? 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-white/50 text-primary font-bold' 
            : 'text-gray-500 hover:bg-white/40 hover:text-gray-900 font-medium border border-transparent'"
        >
          <component 
            :is="item.icon" 
            class="w-5 h-5 transition-transform duration-300"
            :class="$route.path.startsWith(item.path) ? 'scale-110' : 'group-hover:scale-110 text-gray-400 group-hover:text-gray-600'"
          />
          <span>{{ item.name }}</span>
        </NuxtLink>
      </nav>

      <div class="p-6 border-t border-gray-100/50">
        <button 
          @click="handleLogout"
          class="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-bold border border-transparent hover:border-red-100 group"
        >
          <LogOut class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content con fondos abstractos -->
    <main class="flex-1 overflow-y-auto relative">
      <div class="absolute top-0 right-0 w-[50vw] h-[50vw] bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div class="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-50/50 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3" />
      
      <div class="p-8 lg:p-12 min-h-full relative z-10 max-w-7xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LayoutDashboard, Calendar, UtensilsCrossed, ChefHat, LogOut, Search } from 'lucide-vue-next'

const auth = useAuth()
const user = auth.user
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  if (!user.value && route.path !== '/login') {
    router.push('/login')
  }
})

const navItems = [
  { name: "Panel Admin", path: "/dashboard/admin", icon: LayoutDashboard, roles: ["admin"] },
  { name: "Maitre", path: "/dashboard/maitre", icon: Calendar, roles: ["admin", "maitre"] },
  { name: "Historial Clientes", path: "/dashboard/clientes", icon: Search, roles: ["admin", "maitre"] },
  { name: "Mesero", path: "/dashboard/mesero", icon: UtensilsCrossed, roles: ["admin", "mesero"] },
  { name: "Cocina", path: "/dashboard/cocinero", icon: ChefHat, roles: ["admin", "cocinero"] },
]

const visibleItems = computed(() => {
  if (!user.value) return []
  return navItems.filter(item => item.roles.includes(user.value!.role))
})

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>
