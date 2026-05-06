import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useInventory } from '../store/InventoryContext'

function AdminInventoryEdit() {
  // Редагування розділене на текстові дані та фото.
  const { id } = useParams()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [photo, setPhoto] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isSavingText, setIsSavingText] = useState(false)
  const [isSavingPhoto, setIsSavingPhoto] = useState(false)
  const [error, setError] = useState('')
  const [textMessage, setTextMessage] = useState('')
  const [photoMessage, setPhotoMessage] = useState('')
  const { getItemById, saveInventoryItem, saveInventoryPhoto, isLoading } = useInventory()

  const item = getItemById(id)

  useEffect(() => {
    // Підтягуємо початкові значення лише один раз, коли item уже є в контексті.
    if (item && !isInitialized) {
      setName(item.name || '')
      setDescription(item.description || '')
      setImageUrl(item.imageUrl || item.photoUrl || item.previewUrl || item.image || '')
      setError('')
      setIsInitialized(true)
    }
  }, [id, item, isInitialized])

  const handleTextSubmit = async (event) => {
    event.preventDefault()
    setTextMessage('')

    // Назва обов'язкова навіть для оновлення.
    if (!name.trim()) {
      setError("Назва є обов'язковою")
      return
    }

    setIsSavingText(true)

    try {
      await saveInventoryItem(id, {
        name: name.trim(),
        inventory_name: name.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
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

    // Фото оновлюється окремо, тільки якщо файл вибраний.
    if (!photo) {
      setError('Оберіть фото для завантаження')
      return
    }

    setIsSavingPhoto(true)

    try {
      await saveInventoryPhoto(id, photo)
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
        <Link className="admin-button admin-button-secondary" to="/">
          Back to list
        </Link>
      </header>

      <section className="admin-card">
        {isLoading ? <p>Loading item...</p> : null}
        {error ? <p className="inventory-form-error">{error}</p> : null}

        {!isLoading && item ? (
          <div className="inventory-edit-grid">
            <form className="inventory-form" onSubmit={handleTextSubmit}>
              <h2>Текстові дані</h2>

              <div className="inventory-form-field">
                <label htmlFor="name">Назва героя</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className="inventory-form-field">
                <label htmlFor="description">Опис героя</label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div className="inventory-form-field">
                <label htmlFor="imageUrl">Посилання на картинку</label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                />
              </div>

              {textMessage ? <p>{textMessage}</p> : null}

              <button type="submit" className="admin-button" disabled={isSavingText}>
                {isSavingText ? 'Збереження...' : 'Оновити текст'}
              </button>
            </form>

            <form className="inventory-form" onSubmit={handlePhotoSubmit}>
              <h2>Фото</h2>

              <div className="inventory-form-field">
                <label htmlFor="photo">Фото героя</label>
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
                {isSavingPhoto ? 'Завантаження...' : 'Оновити фото'}
              </button>
            </form>
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default AdminInventoryEdit
