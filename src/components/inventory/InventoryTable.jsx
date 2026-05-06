import { Link } from 'react-router-dom'

function InventoryTable({ items = [], onDelete }) {
  // Таблиця списку: назва, опис, прев'ю фото і дії.
  // Кожен рядок тут відповідає окремому товару, а дії ведуть на перегляд, редагування або видалення.
  return (
    <table className="admin-table inventory-table">
      <thead>
        <tr className="admin-table-row admin-table-head">
          <th>Назва</th>
          <th>Опис</th>
          <th>Фото (прев'ю)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          // Вибираємо перше доступне поле з картинкою.
          const imageSrc = item.imageUrl || item.photoUrl || item.previewUrl || item.image

          return (
            <tr key={item.id} className="admin-table-row inventory-table-row">
              <td>
                <Link to={`/details/${item.id}`}>{item.name}</Link>
              </td>
              <td>{item.description || '-'}</td>
              <td>
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
              </td>
              <td className="inventory-table-actions">
                <Link to={`/details/${item.id}`} aria-label="View details">
                  👁️
                </Link>
                <Link to={`/edit/${item.id}`} aria-label="Edit item">
                  ✏️
                </Link>
                <button type="button" onClick={() => onDelete?.(item)}>
                  🗑️
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default InventoryTable
