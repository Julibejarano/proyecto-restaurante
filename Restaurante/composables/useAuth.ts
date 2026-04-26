import { ref } from 'vue'

export type UserRole = 'admin' | 'maitre' | 'mesero' | 'cocinero'
export interface UserSession {
  id: number
  username: string
  name: string
  role: UserRole
  roleLabel: string
}

export function useAuth() {
  const user = useState<UserSession | null>('auth-user', () => null)

  const fetchUser = async () => {
    try {
      const response = await $fetch('/api/auth/me')
      user.value = response.user as UserSession
    } catch {
      user.value = null
    }
  }

  const logout = () => {
    useCookie('auth_token').value = null
    user.value = null
  }

  return {
    user,
    fetchUser,
    logout,
  }
}
