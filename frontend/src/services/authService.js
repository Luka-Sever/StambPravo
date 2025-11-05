import { post } from './httpClient.js'

export function login({ email, password }) {
  return post('/auth/login', { email, password })
}

export function register({ name, email, password }) {
  return post('/auth/register', { name, email, password })
}


