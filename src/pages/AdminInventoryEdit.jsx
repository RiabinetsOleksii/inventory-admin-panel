import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getInventory, updateItem, updateItemPhoto } from '../services/inventoryApi'

function AdminInventoryEdit() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingText, setIsSavingText] = useState(false)
  const [isSavingPhoto, setIsSavingPhoto] = useState(false)
  const [error, setError] = useState('')
  const [textMessage, setTextMessage] = useState('')
  const [photoMessage, setPhotoMessage] = useState('')

  useEffect(() => {
    let isActive = true

    const loadItem = async () => {
      try {
        const inventory = await getInventory()
        const items = Array.isArray(inventory) ? inventory : inventory?.items || []
        const foundItem = items.find((currentItem) => String(currentItem.id) === String(id)) || null

        if (isActive) {
          setItem(foundItem)
          setName(foundItem?.name || '')
          setDescription(foundItem?.description || '')
          setError(foundItem ? '' : 'Позицію не знайдено')
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

  const handleTextSubmit = async (event) => {
    event.preventDefault()
    setTextMessage('')

    if (!name.trim()) {
      setError("Назва є обов'язковою")
      return
    }

    setIsSavingText(true)

    try {
      await updateItem(id, {
        name: name.trim(),
        description: description.trim(),
      })
      setError('')
      setTextMessage('Текстові дані оновлено')
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Не вдалося оновити дані')
    } finally {
      setIsSavingText(false)
    }
  }

  const handlePhotoSubmit = async (event) => {
    event.preventDefault()
    setPhotoMessage('')

    if (!photo) {
      setError('Оберіть фото для завантаження')
      return
    }

    setIsSavingPhoto(true)

    try {
      await updateItemPhoto(id, photo)
      setError('')
      setPhotoMessage('Фото оновлено')
      setPhoto(null)
      event.target.reset()
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Не вдалося оновити фото')
    } finally {
      setIsSavingPhoto(false)
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Admin inventory</p>
          <h1>Edit item</h1>
          <p className="admin-copy">Change text data separately from the item photo.</p>
        </div>
        <Link className="admin-button admin-button-secondary" to="/admin/inventory">
          Back to list
        </Link>
      </header>

      <section className="admin-card">
        {isLoading ? <p>Loading item...</p> : null}
        {error ? <p className="inventory-form-error">{error}</p> : null}

        {!isLoading && item ? (
          <div className="inventory-edit-grid">
            <form className="inventory-form" onSubmit={handleTextSubmit}>
              <h2>Text data</h2>

              <div className="inventory-form-field">
                <label htmlFor="name">Назва</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className="inventory-form-field">
                <label htmlFor="description">Опис</label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              {textMessage ? <p>{textMessage}</p> : null}

              <button type="submit" className="admin-button" disabled={isSavingText}>
                {isSavingText ? 'Saving...' : 'Update text'}
              </button>
            </form>

            <form className="inventory-form" onSubmit={handlePhotoSubmit}>
              <h2>Photo</h2>

              <div className="inventory-form-field">
                <label htmlFor="photo">Фото</label>
                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setPhoto(event.target.files?.[0] || null)}
                />
              </div>

              {photoMessage ? <p>{photoMessage}</p> : null}

              <button type="submit" className="admin-button" disabled={isSavingPhoto}>
                {isSavingPhoto ? 'Uploading...' : 'Update photo'}
              </button>
            </form>
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default AdminInventoryEdit
