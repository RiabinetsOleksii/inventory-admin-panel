import { useNavigate } from 'react-router-dom'
import InventoryForm from '../components/inventory/InventoryForm'
import { useInventory } from '../store/InventoryContext'

function AdminInventoryCreate() {
  // Форма створення працює через спільний контекст інвентарю.
  const navigate = useNavigate()
  const { addInventoryItem } = useInventory()

  const handleCreate = async (formData) => {
    // Після створення повертаємось до списку.
    await addInventoryItem(formData)
    navigate('/')
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Admin inventory</p>
          <h1>Add inventory item</h1>
          <p className="admin-copy">Fill in the item name, description, and optional photo.</p>
        </div>
        <button type="button" className="admin-button admin-button-secondary" onClick={() => navigate('/')}>
          Back to list
        </button>
      </header>

      <section className="admin-card">
        <InventoryForm submitLabel="Create item" onSubmit={handleCreate} />
      </section>
    </main>
  )
}

export default AdminInventoryCreate
