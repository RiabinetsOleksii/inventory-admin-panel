// форма додавання
import { useState } from 'react'

const initialFormState = {
  name: '',
  description: '',
  imageUrl: '',
  photo: null,
}

function InventoryForm({
  initialValues = initialFormState,
  onSubmit,
  submitLabel = 'Зберегти',
  isSubmitting = false,
  submitError = '',
}) {
  // Локальний стан форми для створення товару.
  // Сам компонент не зберігає дані назавжди — він лише збирає їх перед відправкою.
  const [formValues, setFormValues] = useState({
    name: initialValues.name || '',
    description: initialValues.description || '',
    imageUrl: initialValues.imageUrl || '',
    photo: null,
  })
  const [errors, setErrors] = useState({})
  const [localError, setLocalError] = useState('')

  const handleChange = (event) => {
    const { name, value, files } = event.target

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: name === 'photo' ? files?.[0] || null : value,
    }))

    if (name === 'name' && errors.name) {
      setErrors((currentErrors) => ({ ...currentErrors, name: '' }))
    }
  }

  const validate = () => {
    // Мінімальна валідація: назва має бути заповнена.
    const nextErrors = {}

    if (!formValues.name.trim()) {
      nextErrors.name = "Назва є обов'язковою"
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setLocalError('')

    // Якщо валідація не пройдена, сабміт зупиняється.
    if (!validate()) {
      return
    }

    try {
      await onSubmit?.({
        name: formValues.name.trim(),
        inventory_name: formValues.name.trim(),
        description: formValues.description.trim(),
        imageUrl: formValues.imageUrl.trim(),
        photo: formValues.photo,
      })
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Сталася помилка під час створення')
    }
  }

  return (
    <form className="inventory-form" onSubmit={handleSubmit}>
      <div className="inventory-form-field">
        <label htmlFor="name">Назва героя</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formValues.name}
          onChange={handleChange}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name ? (
          <p className="inventory-form-error" id="name-error">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className="inventory-form-field">
        <label htmlFor="description">Опис героя</label>
        <textarea
          id="description"
          name="description"
          rows="5"
          value={formValues.description}
          onChange={handleChange}
        />
      </div>

      <div className="inventory-form-field">
        <label htmlFor="imageUrl">Посилання на картинку</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://..."
          value={formValues.imageUrl}
          onChange={handleChange}
        />
        <p className="inventory-form-hint">
          {formValues.imageUrl ? 'Картинка буде підставлена з посилання' : 'Можна вставити URL картинки з сайту або залишити порожнім'}
        </p>
      </div>

      <div className="inventory-form-field">
        <label htmlFor="photo">Фото героя</label>
        <input id="photo" name="photo" type="file" accept="image/*" onChange={handleChange} />
        <p className="inventory-form-hint">
          {formValues.photo ? `Обрано файл: ${formValues.photo.name}` : 'Можна завантажити фото товару'}
        </p>
      </div>

      {localError || submitError ? (
        <p className="inventory-form-error" role="alert">
          {localError || submitError}
        </p>
      ) : null}

      <button type="submit" className="admin-button" disabled={isSubmitting}>
        {isSubmitting ? 'Збереження...' : submitLabel}
      </button>
    </form>
  )
}

export default InventoryForm
