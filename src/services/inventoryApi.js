const API_BASE_URL = ''
const INVENTORY_STORAGE_KEY = 'inventory-items'
const USE_MOCK_STORAGE = !API_BASE_URL

const DOTA_SEED_NAMES = [
  'Акс',
  'Брімастрік',
  'Даззл',
  'Морфлінг',
  'Пудж',
  'Кристал Мейден',
]

// Демонстраційні дані, якщо окремого backend немає.
// Вони гарантують, що список інвентарю не буде порожнім під час демонстрації або без API.
const seedInventory = [
  {
    id: '2001',
    name: 'Акс',
    inventory_name: 'Акс',
    description: 'Невтомний воїн першої лінії, який кидається в бій без вагань.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/axe_full.png',
    color: 'Червоний',
    quantity: 1,
  },
  {
    id: '2002',
    name: 'Брімастрік',
    inventory_name: 'Брімастрік',
    description: 'Маг вогню, що контролює поле бою та завдає шкоди з відстані.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/brewmaster_full.png',
    color: 'Помаранчевий',
    quantity: 1,
  },
  {
    id: '2003',
    name: 'Даззл',
    inventory_name: 'Даззл',
    description: 'Підтримка команди, лікування та корисні закляття для довгих боїв.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/dazzle_full.png',
    color: 'Фіолетовий',
    quantity: 1,
  },
  {
    id: '2004',
    name: 'Морфлінг',
    inventory_name: 'Морфлінг',
    description: 'Гнучкий герой, який змінює форму та підлаштовується під ситуацію.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/morphling_full.png',
    color: 'Блакитний',
    quantity: 1,
  },
  {
    id: '2005',
    name: 'Пудж',
    inventory_name: 'Пудж',
    description: 'Небезпечний герой ближнього бою, який затягує ворогів у пастку.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge_full.png',
    color: 'Зелений',
    quantity: 1,
  },
  {
    id: '2006',
    name: 'Кристал Мейден',
    inventory_name: 'Кристал Мейден',
    description: 'Магічна підтримка з потужним контролем і холодною силою.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/crystal_maiden_full.png',
    color: 'Синій',
    quantity: 1,
  },
]

function refreshStoredSeed(items) {
  const seedById = new Map(seedInventory.map((item) => [String(item.id), item]))

  return items.map((item) => {
    const matchingSeed = seedById.get(String(item.id)) || seedInventory.find((seedItem) => seedItem.name === item.name)

    return matchingSeed
      ? {
          ...matchingSeed,
          ...item,
          imageUrl: matchingSeed.imageUrl,
          inventory_name: matchingSeed.inventory_name,
          name: matchingSeed.name,
        }
      : item
  })
}

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
    const isValidArray = Array.isArray(parsedValue)

    if (!isValidArray) {
      window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(seedInventory))
      return seedInventory
    }

    const refreshedValue = refreshStoredSeed(parsedValue)
    window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(refreshedValue))
    return refreshedValue
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
  const itemName = data.inventory_name || data.name || ''
  return {
    id: nextId,
    name: itemName,
    inventory_name: itemName,
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
      String(item.id) === String(id)
        ? {
            ...item,
            ...data,
            name: data.inventory_name || data.name || item.name,
            inventory_name: data.inventory_name || data.name || item.inventory_name || item.name,
          }
        : item,
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
