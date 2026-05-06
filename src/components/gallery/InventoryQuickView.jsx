function getItemImage(item) {
	return item?.imageUrl || item?.photoUrl || item?.previewUrl || item?.image || ''
}

function InventoryQuickView({ item, isFavorite, onToggleFavorite, onClose }) {
	if (!item) {
		return null
	}

	const imageSrc = getItemImage(item)

	return (
		<div className="inventory-quick-view-overlay" onClick={onClose} role="presentation">
			<section className="inventory-quick-view" role="dialog" aria-modal="true" aria-labelledby="inventory-quick-view-title" onClick={(event) => event.stopPropagation()}>
				<button type="button" className="inventory-quick-view-close" onClick={onClose} aria-label="Close quick view">
					×
				</button>

				{imageSrc ? <img src={imageSrc} alt={item.name} className="inventory-quick-view-image" /> : <div className="inventory-quick-view-placeholder">Немає фото</div>}

				<div className="inventory-quick-view-content">
					<h2 id="inventory-quick-view-title">{item.name}</h2>
					<p>{item.description || 'Опис відсутній'}</p>

					<button type="button" className="inventory-quick-view-favorite" onClick={() => onToggleFavorite?.(item.id)}>
						{isFavorite ? '♥ У вибране' : '♡ У вибране'}
					</button>
				</div>
			</section>
		</div>
	)
}

export default InventoryQuickView
