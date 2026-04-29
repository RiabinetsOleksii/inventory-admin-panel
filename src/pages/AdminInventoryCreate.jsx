import { useNavigate } from 'react-router-dom'
import InventoryForm from '../components/inventory/InventoryForm'
import { createItem } from '../services/inventoryApi'

function AdminInventoryCreate() {
  const navigate = useNavigate()

  const handleCreate = async (formData) => {
    await createItem(formData)
    navigate('/admin/inventory')
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Admin inventory</p>
          <h1>Add inventory item</h1>
          <p className="admin-copy">Fill in the item name, description, and optional photo.</p>
        </div>
      </header>

      <section className="admin-card">
        <InventoryForm submitLabel="Create item" onSubmit={handleCreate} />
      </section>
    </main>
  )
}

export default AdminInventoryCreate
