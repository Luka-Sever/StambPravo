import { API_BASE_URL } from '../config/api.js'
import { get, post } from './httpClient.js'

export function login({ email, password }) {
  return post('/auth/login', { email, password })
}

export function register({ role, firstName, lastName, email }) {
  // Backend expects: { firstName, lastName, email, role } at /api/admin/user
  return post('/api/admin/user', { firstName, lastName, email, role })
}

export function fetchUser() {
  return get('/user')
}

export function oauthLogin(provider = 'google') {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`
}

export function logout() {
  return post('/logout', {})
}


