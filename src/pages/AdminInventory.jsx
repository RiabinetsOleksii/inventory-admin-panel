import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmModal from '../components/inventory/ConfirmModal'
import InventoryTable from '../components/inventory/InventoryTable'
import { deleteItem, fetchInventory } from '../services/inventoryApi'

function AdminInventory() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let isActive = true

    const loadInventory = async () => {
      try {
        const inventory = await fetchInventory()
        const normalizedItems = Array.isArray(inventory) ? inventory : inventory?.items || []

        if (isActive) {
          setItems(normalizedItems)
          setError('')
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Не вдалося завантажити список')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadInventory()

    return () => {
      isActive = false
    }
  }, [])

  const handleDeleteRequest = (item) => {
    setItemToDelete(item)
  }

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setItemToDelete(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteItem(itemToDelete.id)
      setItems((currentItems) => currentItems.filter((item) => String(item.id) !== String(itemToDelete.id)))
      setItemToDelete(null)
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Не вдалося видалити позицію')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Admin inventory</p>
          <h1>Inventory list</h1>
          <p className="admin-copy">Browse items, open details, or add a new product.</p>
        </div>
        <Link className="admin-button" to="/create">
          Add item
        </Link>
      </header>

      <section className="admin-card">
        {error ? <p className="inventory-form-error">{error}</p> : null}
        {isLoading ? <p>Loading inventory...</p> : <InventoryTable items={items} onDelete={handleDeleteRequest} />}
      </section>

      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        title="Видалити позицію?"
        description={itemToDelete ? `Позиція «${itemToDelete.name}» буде видалена без можливості відновлення.` : ''}
        confirmLabel={isDeleting ? 'Видалення...' : 'Видалити'}
        cancelLabel="Скасувати"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </main>
  )
}

export default AdminInventory
