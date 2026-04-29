import { Link } from 'react-router-dom'

const inventoryItems = [
  { id: '1001', name: 'Laptop Pro 14', quantity: 12, status: 'In stock' },
  { id: '1002', name: 'Wireless Mouse', quantity: 48, status: 'In stock' },
  { id: '1003', name: 'USB-C Dock', quantity: 6, status: 'Low stock' },
]

function AdminInventory() {
  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Admin inventory</p>
          <h1>Inventory list</h1>
          <p className="admin-copy">Browse items, open details, or add a new product.</p>
        </div>
        <Link className="admin-button" to="/admin/inventory/create">
          Add item
        </Link>
      </header>

      <section className="admin-card">
        <div className="admin-table">
          <div className="admin-table-row admin-table-head">
            <span>Item</span>
            <span>Quantity</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {inventoryItems.map((item) => (
            <div key={item.id} className="admin-table-row">
              <span>{item.name}</span>
              <span>{item.quantity}</span>
              <span>{item.status}</span>
              <Link to={`/admin/inventory/${item.id}`}>View</Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default AdminInventory
