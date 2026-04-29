function ConfirmModal({
  isOpen = false,
  title = 'Підтвердження дії',
  description = 'Ви впевнені, що хочете продовжити?',
  confirmLabel = 'Підтвердити',
  cancelLabel = 'Скасувати',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="confirm-modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-modal-title">{title}</h2>
        <p id="confirm-modal-description">{description}</p>

        <div className="confirm-modal-actions">
          <button type="button" className="admin-button admin-button-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="admin-button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal