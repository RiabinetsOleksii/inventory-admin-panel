import { Link } from 'react-router-dom'

function AdminInventoryCreate() {
  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Admin inventory</p>
          <h1>Add inventory item</h1>
          <p className="admin-copy">This page is a scaffold for the add-item form.</p>
        </div>
        <Link className="admin-button admin-button-secondary" to="/admin/inventory">
          Back to list
        </Link>
      </header>

      <section className="admin-card">
        <p>Form fields will go here in the next stage.</p>
      </section>
    </main>
  )
}

export default AdminInventoryCreate
