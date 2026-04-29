const API_BASE_URL = ''

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export function getInventory() {
  return request('/inventory')
}

export function createItem(data) {
  const formData = data instanceof FormData ? data : new FormData()

  if (!(data instanceof FormData)) {
    Object.entries(data || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value)
      }
    })
  }

  return request('/register', {
    method: 'POST',
    body: formData,
  })
}

export function deleteItem(id) {
  return request(`/inventory/${id}`, {
    method: 'DELETE',
  })
}
