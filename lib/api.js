const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')

function buildUrl(path, query) {
  // When running in the browser, route requests through a server-side proxy
  // to avoid CORS issues with external json-server endpoints.
  const isBrowser = typeof window !== 'undefined'

  if (isBrowser) {
    /** Phòng: CRUD qua API Next (/api/rooms). Proxy json-server thường không POST được → tránh 500. */
    if (path === '/rooms') {
      let internal = '/api/rooms'
      if (query && typeof query === 'object') {
        const params = new URLSearchParams()
        for (const [key, value] of Object.entries(query)) {
          if (value === undefined || value === null || value === '') continue
          params.set(key, String(value))
        }
        const qs = params.toString()
        if (qs) internal += `?${qs}`
      }
      return internal
    }

    if (path.startsWith('/rooms/')) {
      const rest = path.slice('/rooms/'.length).split('?')[0]
      if (rest && !rest.includes('/')) {
        let internal = `/api/rooms/${rest}`
        if (query && typeof query === 'object') {
          const params = new URLSearchParams()
          for (const [key, value] of Object.entries(query)) {
            if (value === undefined || value === null || value === '') continue
            params.set(key, String(value))
          }
          const qs = params.toString()
          if (qs) internal += `?${qs}`
        }
        return internal
      }
    }

    const base = '/api/proxy'
    const p = path.replace(/^\//, '')
    const url = new URL(`${base}/${p}`, 'http://localhost')

    if (query && typeof query === 'object') {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null || value === '') continue
        url.searchParams.set(key, String(value))
      }
    }

    return `${url.pathname}${url.search}`
  }

  const url = new URL(path.replace(/^\//, ''), API_BASE_URL ? `${API_BASE_URL}/` : 'http://localhost')

  if (query && typeof query === 'object') {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }

  return API_BASE_URL ? url.toString() : `${url.pathname}${url.search}`
}

async function readResponse(response) {
  if (response.status === 204) return null

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return await response.json()
  }

  const text = await response.text()
  return text ? text : null
}

async function request(path, options = {}) {
  const { query, body, headers, ...init } = options
  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await readResponse(response)

  if (!response.ok) {
    const message = data && typeof data === 'object' && 'message' in data ? data.message : `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return data
}

async function getOne(path, query) {
  const data = await request(path, { method: 'GET', query })
  if (Array.isArray(data)) return data[0] ?? null
  return data ?? null
}

export const userApi = {
  async login(email, password) {
    return getOne('/users', { email, password })
  },

  async register(data) {
    return request('/users', {
      method: 'POST',
      body: {
        role: 'user',
        ...data,
      },
    })
  },

  async getById(id) {
    if (!id) return null
    return getOne(`/users/${encodeURIComponent(id)}`)
  },
}

export const roomApi = {
  async getAll() {
    const data = await request('/rooms', { method: 'GET' })
    return Array.isArray(data) ? data : []
  },

  async getById(id) {
    if (!id) return null
    return getOne(`/rooms/${encodeURIComponent(id)}`)
  },

  async create(data) {
    return request('/rooms', { method: 'POST', body: data })
  },

  async update(id, data) {
    if (!id) return null
    return request(`/rooms/${encodeURIComponent(id)}`, { method: 'PUT', body: data })
  },

  async delete(id) {
    if (!id) return null
    return request(`/rooms/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
}

export const bookingApi = {
  async getAll(userId) {
    const query = userId ? { userId } : undefined
    const data = await request('/bookings', { method: 'GET', query })
    let list = Array.isArray(data) ? data : []
    if (userId) {
      const want = String(userId)
      list = list.filter((b) => {
        const uid = b.userId ?? b.user_id ?? b.customerId
        return uid != null && String(uid) === want
      })
    }
    return list
  },

  async create(data) {
    return request('/bookings', { method: 'POST', body: data })
  },

  async delete(id) {
    if (!id) return null
    return request(`/bookings/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },

  async updateStatus(id, status) {
    if (!id) return null
    return request(`/bookings/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: { status },
    })
  },
}

export { API_BASE_URL, request }
