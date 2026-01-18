import { API_BASE_URL } from '../config/api.js'
import { get, post } from './httpClient.js'

export function login({ loginToken, password }) {
  return post('/auth/login', { loginToken, password })
}

export function register({ role, firstName, lastName, email , password}) {
  // Backend expects: { firstName, lastName, email, role } at /api/admin/user
  return post('/api/admin/user', { firstName, lastName, email, password, role })
}

export function fetchUser() {
  return get('/api/user')
}

export function oauthLogin(provider = 'google') {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`
}

export function logout() {
  return post('/logout', {})
}

export function changePassword(passwordData) {
  return post('/api/user/change-password', passwordData);
}
