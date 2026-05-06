import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createItem, deleteItem, getInventory, updateItem, updateItemPhoto } from '../services/inventoryApi'

// Контекст тримає спільний список товарів і CRUD-операції для всіх сторінок.
const InventoryContext = createContext(null)

function normalizeInventory(inventory) {
  // Приводить відповідь сервера до єдиного формату масиву.
  // Це робить код сторінок простішим, бо вони завжди працюють з arrays.
  if (Array.isArray(inventory)) {
    return inventory
  }

  return inventory?.items || []
}

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Завантажує актуальний список на старті та при потребі оновлення.
  const loadInventory = async () => {
    setIsLoading(true)

    try {
      const inventory = await getInventory()
      setItems(normalizeInventory(inventory))
      setError('')
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не вдалося завантажити список')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [])

  // Додає новий елемент у спільний стан після створення.
  const addInventoryItem = async (data) => {
    const createdItem = await createItem(data)

    if (createdItem) {
      setItems((currentItems) => [createdItem, ...currentItems])
    } else {
      await loadInventory()
    }

    return createdItem
  }

  const removeInventoryItem = async (id) => {
    // Видалення синхронізує backend/fallback і локальний список.
    await deleteItem(id)
    setItems((currentItems) => currentItems.filter((item) => String(item.id) !== String(id)))
  }

  // Оновлює тільки текстові поля товару.
  const saveInventoryItem = async (id, data) => {
    const updatedItem = await updateItem(id, data)

    setItems((currentItems) =>
      currentItems.map((item) =>
        String(item.id) === String(id) ? { ...item, ...data, ...(updatedItem || {}) } : item,
      ),
    )

    return updatedItem
  }

  const saveInventoryPhoto = async (id, photo) => {
    // Окреме оновлення фото, щоб не змішувати з JSON-запитом.
    const updatedItem = await updateItemPhoto(id, photo)

    setItems((currentItems) =>
      currentItems.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              ...(updatedItem || {}),
              imageUrl: updatedItem?.imageUrl || updatedItem?.photoUrl || item.imageUrl || item.photoUrl,
            }
          : item,
      ),
    )

    return updatedItem
  }

  // Зручний пошук елемента для сторінок деталей і редагування.
  const getItemById = (id) => items.find((item) => String(item.id) === String(id)) || null

  const value = useMemo(
    () => ({
      items,
      isLoading,
      error,
      loadInventory,
      addInventoryItem,
      removeInventoryItem,
      saveInventoryItem,
      saveInventoryPhoto,
      getItemById,
    }),
    [error, isLoading, items],
  )

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const context = useContext(InventoryContext)

  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider')
  }

  return context
}