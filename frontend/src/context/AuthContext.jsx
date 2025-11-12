import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { API_BASE_URL } from '../config/api.js'
import { fetchUser, login as loginRequest, logout as logoutRequest, register as registerRequest } from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed.user || null)
        setToken(parsed.token || null)
      } catch (_) {
        // ignore invalid storage
      }
    }
    ; (async () => {
      try {
        const sessionUser = await fetchUser()
        if (sessionUser && (sessionUser.name || sessionUser.firstName)) {
          setUser({ firstName: sessionUser.name || sessionUser.firstName })
        }
      } catch (_) {
        // not logged in via session
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  function persist(nextUser, nextToken) {
    setUser(nextUser)
    setToken(nextToken)
    localStorage.setItem('auth', JSON.stringify({ user: nextUser, token: nextToken }))
  }

  async function login(credentials) {
    const data = await loginRequest(credentials)
    // Try common shapes: {token, user} or {accessToken, ...user}
    const nextToken = data?.token || data?.accessToken || null
    const nextUser =
      data?.user ||
      (data?.firstName ? { firstName: data.firstName, lastName: data.lastName, role: data.role } : null)
    persist(nextUser, nextToken)
    return { user: nextUser, token: nextToken, raw: data }
  }

  function oauthLogin(provider = 'google') {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`
  }

  async function register(payload) {
    const data = await registerRequest(payload)
    // Some APIs auto-login after register; handle both cases
    const nextToken = data?.token || data?.accessToken || null
    const nextUser =
      data?.user ||
      (data?.firstName ? { firstName: data.firstName, lastName: data.lastName, role: data.role } : null)
    if (nextToken || nextUser) {
      persist(nextUser, nextToken)
    }
    return { user: nextUser, token: nextToken, raw: data }
  }

  function logout() {
    ; (async () => {
      try {
        await logoutRequest()
      } catch (_) { }
      setUser(null)
      setToken(null)
      localStorage.removeItem('auth')
      // Ensure we are back on homepage after server logout
      try {
        window.location.href = '/'
      } catch (_) { }
    })()
  }

  const value = useMemo(
    () => ({ user, token, loading, isAuthenticated: !!token || !!user, login, oauthLogin, register, logout }),
    [user, token, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


