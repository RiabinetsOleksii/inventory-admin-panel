import { Link, useParams } from 'react-router-dom'

function AdminInventoryDetails() {
  const { id } = useParams()

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Admin inventory</p>
          <h1>Item details</h1>
          <p className="admin-copy">Review inventory information for item {id}.</p>
        </div>
        <Link className="admin-button admin-button-secondary" to="/admin/inventory">
          Back to list
        </Link>
      </header>

      <section className="admin-card">
        <p>Details view for item ID: {id}</p>
      </section>
    </main>
  )
}

export default AdminInventoryDetails
