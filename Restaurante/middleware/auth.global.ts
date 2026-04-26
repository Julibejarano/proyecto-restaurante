export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') {
    return
  }

  const auth = useAuth()
  await auth.fetchUser()

  if (!auth.user.value) {
    return navigateTo('/login')
  }
})
