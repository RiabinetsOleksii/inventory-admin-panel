function getItemImage(item) {
	return item?.imageUrl || item?.photoUrl || item?.previewUrl || item?.image || (item?.id ? `/inventory/${item.id}/photo` : '')
}

function InventoryCard({ item, isFavorite, onToggleFavorite, onSelect }) {
	const imageSrc = getItemImage(item)
	const title = item?.inventory_name || item?.name || 'Без назви'

	return (
		<article
			className="inventory-card"
			role="button"
			tabIndex={0}
			onClick={() => onSelect?.(item)}
			onKeyDown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault()
					onSelect?.(item)
				}
			}}
		>
			<button
				type="button"
				className={`inventory-card-favorite ${isFavorite ? 'is-active' : ''}`}
				onClick={(event) => {
					event.stopPropagation()
					onToggleFavorite?.(item.id)
				}}
				aria-pressed={isFavorite}
				aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
			>
				{isFavorite ? '♥' : '♡'}
			</button>

			{imageSrc ? (
				<img src={imageSrc} alt={title} className="inventory-card-image" />
			) : (
				<div className="inventory-card-placeholder">Немає фото</div>
			)}

			<div className="inventory-card-content">
				<h2>{title}</h2>
				<p>{item?.description || 'Опис відсутній'}</p>
			</div>
		</article>
	)
}

export default InventoryCard
