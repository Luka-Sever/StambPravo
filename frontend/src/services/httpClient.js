import { API_BASE_URL } from '../config/api.js'

function buildUrl(path) {
  if (!path.startsWith('/')) return `${API_BASE_URL}/${path}`
  return `${API_BASE_URL}${path}`
}

async function request(path, { method = 'GET', headers = {}, body } = {}) {
  const url = buildUrl(path)
  const finalHeaders = { 'Content-Type': 'application/json', ...headers }
  let response
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    throw err
  }

  let data = null
  let rawText = null
  try {
    const clone = response.clone()
    try {
      data = await response.json()
    } catch {
      rawText = await clone.text()
    }
  } catch (_) {
    //empty
  }

  if (!response.ok) {
    const message = (data && (data.message || data.error)) || response.statusText || 'Request failed'
    const error = new Error(message)
    error.status = response.status
    error.data = data
    error.url = url
    error.method = method
    error.rawText = rawText
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


