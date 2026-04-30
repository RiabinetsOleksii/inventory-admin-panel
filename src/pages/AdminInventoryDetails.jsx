import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchInventoryById } from '../services/inventoryApi'

function AdminInventoryDetails() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    const loadItem = async () => {
      try {
        const response = await fetchInventoryById(id)
        const normalizedItem = response?.item || response

        if (isActive) {
          setItem(normalizedItem)
          setError(normalizedItem ? '' : 'Позицію не знайдено')
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Не вдалося завантажити позицію')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadItem()

    return () => {
      isActive = false
    }
  }, [id])

  const imageSrc = item?.imageUrl || item?.photoUrl || item?.previewUrl || item?.image
  const characteristics = item
    ? Object.entries(item).filter(
        ([key, value]) =>
          !['id', 'name', 'description', 'imageUrl', 'photoUrl', 'previewUrl', 'image'].includes(key) &&
          value !== null &&
          value !== undefined &&
          value !== '',
      )
    : []

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Admin inventory</p>
          <h1>Item details</h1>
          <p className="admin-copy">Review inventory information for item {id}.</p>
        </div>
        <Link className="admin-button admin-button-secondary" to="/">
          Back to list
        </Link>
      </header>

      <section className="admin-card">
        {isLoading ? <p>Loading item...</p> : null}
        {!isLoading && error ? <p className="inventory-form-error">{error}</p> : null}

        {!isLoading && item ? (
          <div className="inventory-details">
            <div className="inventory-details-media">
              {imageSrc ? (
                <img src={imageSrc} alt={item.name} className="inventory-details-image" />
              ) : (
                <div className="inventory-details-placeholder">Немає фото</div>
              )}
            </div>

            <div className="inventory-details-content">
              <h2>{item.name}</h2>
              <p>{item.description || 'Опис відсутній'}</p>

              <div className="inventory-details-characteristics">
                <h3>Характеристики</h3>
                {characteristics.length > 0 ? (
                  <dl>
                    {characteristics.map(([key, value]) => (
                      <div key={key}>
                        <dt>{key}</dt>
                        <dd>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p>Додаткові характеристики відсутні.</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default AdminInventoryDetails
