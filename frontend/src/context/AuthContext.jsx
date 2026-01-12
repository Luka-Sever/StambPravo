/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { API_BASE_URL } from '../config/api.js'
import { fetchUser, login as loginRequest, logout as logoutRequest, register as registerRequest } from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Funkcija za spremanje podataka (koristi se u login i register)
  const persist = useCallback((nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
    localStorage.setItem('auth', JSON.stringify({ user: nextUser, token: nextToken }))
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed.user || null)
        setToken(parsed.token || null)
      } catch { /* ignore */ }
    }

    (async () => {
      try {
        const sessionUser = await fetchUser()
        if (sessionUser) {
          setUser({ 
            firstName: sessionUser.firstName || sessionUser.name, 
            lastName: sessionUser.lastName || '',
            role: sessionUser.role 
          })
        }
      } catch { /* ignore */ } finally {
        setLoading(false)
      }
    })()
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await loginRequest(credentials)
    const nextToken = data?.token || data?.accessToken || null
    const nextUser = data?.user || (data?.firstName ? { 
      firstName: data.firstName, 
      lastName: data.lastName, 
      role: data.role 
    } : null)
    persist(nextUser, nextToken)
    return { user: nextUser, token: nextToken, raw: data }
  }, [persist])

  const register = useCallback(async (payload) => {
    const data = await registerRequest(payload)
    const nextToken = data?.token || data?.accessToken || null
    const nextUser = data?.user || (data?.firstName ? { 
      firstName: data.firstName, 
      lastName: data.lastName, 
      role: data.role 
    } : null)
    if (nextToken || nextUser) persist(nextUser, nextToken)
    return { user: nextUser, token: nextToken, raw: data }
  }, [persist])

  const logout = useCallback(async () => {
    try { 
      await logoutRequest(); 
    } catch (err) { 
      console.warn("Server logout failed, continuing with local logout", err);
    }
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth')
    window.location.href = '/'
  }, [])

  const oauthLogin = useCallback((provider = 'google') => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`
  }, [])

  const value = useMemo(
    () => ({ user, token, loading, isAuthenticated: !!token || !!user, login, register, logout, oauthLogin }),
    [user, token, loading, login, register, logout, oauthLogin]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}