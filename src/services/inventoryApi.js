const API_BASE_URL = ''
const INVENTORY_STORAGE_KEY = 'inventory-items'
const USE_MOCK_STORAGE = !API_BASE_URL

// Демонстраційні дані, якщо окремого backend немає.
// Вони гарантують, що список інвентарю не буде порожнім під час демонстрації або без API.
const seedInventory = [
  {
    id: '1001',
    name: 'Laptop Pro 14',
    description: 'Lightweight laptop for admin inventory demos.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    color: 'Space Gray',
    quantity: 12,
  },
  {
    id: '1002',
    name: 'Wireless Mouse',
    description: 'Ergonomic mouse with silent clicks.',
    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80',
    color: 'Black',
    quantity: 48,
  },
  {
    id: '1003',
    name: 'USB-C Dock',
    description: 'Docking station with multiple display outputs.',
    imageUrl: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=600&q=80',
    color: 'Silver',
    quantity: 6,
  },
]

function readStoredInventory() {
  // Читає список із localStorage або повертає seed-дані.
  // Якщо запису ще немає, ініціалізує сховище стартовим набором.
  if (typeof window === 'undefined') {
    return seedInventory
  }

  const storedValue = window.localStorage.getItem(INVENTORY_STORAGE_KEY)

  if (!storedValue) {
    window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(seedInventory))
    return seedInventory
  }

  try {
    const parsedValue = JSON.parse(storedValue)
    return Array.isArray(parsedValue) ? parsedValue : seedInventory
  } catch {
    window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(seedInventory))
    return seedInventory
  }
}

function writeStoredInventory(items) {
  // Записує оновлений список у localStorage.
  // Так зміни зберігаються після перезавантаження сторінки.
  if (typeof window === 'undefined') {
    return items
  }

  window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items))
  return items
}

function createStoredItem(data) {
  // Формує новий елемент для локального fallback CRUD.
  // Цей об'єкт імітує те, що зазвичай повертає backend після POST-запиту.
  const nextId = String(Date.now())
  return {
    id: nextId,
    name: data.name,
    description: data.description || '',
    imageUrl: data.imageUrl || data.photoUrl || data.previewUrl || data.image || '',
    color: data.color || '',
    quantity: data.quantity || '',
  }
}

function toDataUrl(file) {
  // Перетворює файл у data URL для локального прев'ю фото.
  // Це потрібно, щоб зображення можна було показати навіть без upload-сервера.
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Не вдалося прочитати файл'))
    reader.readAsDataURL(file)
  })
}

async function request(path, options = {}) {
  // Стандартний HTTP-запит до backend, якщо він підключений.
  // Якщо backend з'явиться, цей метод можна буде використовувати без змін у UI.
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
  return fetchInventory()
}

export function fetchInventory() {
  if (USE_MOCK_STORAGE) {
    // У fallback-режимі віддаємо масив одразу з localStorage.
    return Promise.resolve(readStoredInventory())
  }

  return request('/inventory')
}

export function fetchInventoryById(id) {
  if (USE_MOCK_STORAGE) {
    // Для details-сторінки шукаємо один запис по id у локальному списку.
    const item = readStoredInventory().find((currentItem) => String(currentItem.id) === String(id))
    return Promise.resolve(item ? { item } : null)
  }

  return request(`/inventory/${id}`)
}

export async function createItem(data) {
  // Створення через API або через localStorage-fallback.
  // Сюди приходять дані з форми створення, включно з фото-файлом.
  const formData = data instanceof FormData ? data : new FormData()

  if (!(data instanceof FormData)) {
    Object.entries(data || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value)
      }
    })
  }

  if (USE_MOCK_STORAGE) {
    // Якщо API недоступний, зберігаємо новий товар локально і повертаємо його одразу.
    const values = Object.fromEntries(formData.entries())
    const file = formData.get('photo')
    const imageUrl = file instanceof File ? await toDataUrl(file) : ''
    const createdItem = createStoredItem({ ...values, imageUrl })
    const currentItems = readStoredInventory()
    writeStoredInventory([createdItem, ...currentItems])
    return createdItem
  }

  return request('/register', {
    method: 'POST',
    body: formData,
  })
}

export async function deleteItem(id) {
  // Видалення через API або локальний fallback.
  // У обох випадках результат один: товар зникає зі списку.
  if (USE_MOCK_STORAGE) {
    const remainingItems = readStoredInventory().filter((item) => String(item.id) !== String(id))
    writeStoredInventory(remainingItems)
    return null
  }

  return request(`/inventory/${id}`, {
    method: 'DELETE',
  })
}

export async function updateItem(id, data) {
  // JSON-оновлення текстових даних.
  // Використовується для назви та опису на сторінці редагування.
  if (USE_MOCK_STORAGE) {
    const updatedItems = readStoredInventory().map((item) =>
      String(item.id) === String(id) ? { ...item, ...data } : item,
    )
    writeStoredInventory(updatedItems)
    return updatedItems.find((item) => String(item.id) === String(id)) || null
  }

  return request(`/inventory/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export async function updateItemPhoto(id, photo) {
  // Окремий multipart-запит для фото.
  // Це спеціально винесено окремо, щоб показати інший тип відправки даних.
  const formData = new FormData()
  formData.append('photo', photo)

  if (USE_MOCK_STORAGE) {
    const imageUrl = photo instanceof File ? await toDataUrl(photo) : ''
    const updatedItems = readStoredInventory().map((item) =>
      String(item.id) === String(id) ? { ...item, imageUrl } : item,
    )
    writeStoredInventory(updatedItems)
    return updatedItems.find((item) => String(item.id) === String(id)) || null
  }

  return request(`/inventory/${id}/photo`, {
    method: 'PUT',
    body: formData,
  })
}
