import { Link } from 'react-router-dom'

function InventoryTable({ items = [], onDelete }) {
  return (
    <div className="admin-table inventory-table">
      <div className="admin-table-row admin-table-head">
        <span>Назва</span>
        <span>Опис</span>
        <span>Фото (прев'ю)</span>
        <span>Дії</span>
      </div>

      {items.map((item) => {
        const imageSrc = item.imageUrl || item.photoUrl || item.previewUrl || item.image

        return (
          <div key={item.id} className="admin-table-row inventory-table-row">
            <span>{item.name}</span>
            <span>{item.description || '-'}</span>
            <span>
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={item.name}
                  className="inventory-table-preview"
                  width="72"
                  height="72"
                />
              ) : (
                <span className="inventory-table-placeholder">Немає фото</span>
              )}
            </span>
            <span className="inventory-table-actions">
              <Link to={`/admin/inventory/${item.id}`}>Переглянути</Link>
              <Link to={`/admin/inventory/${item.id}/edit`}>Редагувати</Link>
              <button type="button" onClick={() => onDelete?.(item)}>
                Видалити
              </button>
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default InventoryTable
