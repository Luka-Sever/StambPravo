import { API_BASE_URL } from '../config/api.js'

function buildUrl(path) {
  if (!path.startsWith('/')) return `${API_BASE_URL}/${path}`
  return `${API_BASE_URL}${path}`
}

async function request(path, { method = 'GET', headers = {}, body } = {}) {
  const finalHeaders = { 'Content-Type': 'application/json', ...headers }
  const response = await fetch(buildUrl(path), {
    method,
    headers: finalHeaders,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let data = null
  try {
    data = await response.json()
  } catch(_) {
      //empty
  }

  if (!response.ok) {
    const message = (data && (data.message || data.error)) || response.statusText || 'Request failed'
    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export function get(path, options = {}) {
  return request(path, { ...options, method: 'GET' })
}

export function post(path, body, options = {}) {
  return request(path, { ...options, method: 'POST', body })
}


