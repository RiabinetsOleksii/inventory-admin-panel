import InventoryCard from './InventoryCard'

function InventoryGallery({ items = [], favoriteIds = [], isLoading = false, emptyMessage = 'Позицій поки немає.', onToggleFavorite, onSelect }) {
	const favoriteSet = new Set(favoriteIds.map(String))

	if (isLoading) {
		return (
			<div className="inventory-grid" aria-live="polite" aria-busy="true">
				{Array.from({ length: 8 }).map((_, index) => (
					<article key={index} className="inventory-card inventory-card-skeleton" aria-hidden="true">
						<div className="inventory-card-skeleton-image" />
						<div className="inventory-card-content">
							<div className="skeleton-line skeleton-line-title" />
							<div className="skeleton-line skeleton-line-text" />
						</div>
					</article>
				))}
			</div>
		)
	}

	if (!items.length) {
		return <p className="gallery-empty">{emptyMessage}</p>
	}

	return (
		<div className="inventory-grid">
			{items.map((item) => (
				<InventoryCard
					key={item.id}
					item={item}
					isFavorite={favoriteSet.has(String(item.id))}
					onToggleFavorite={onToggleFavorite}
					onSelect={onSelect}
				/>
			))}
		</div>
	)
}

export default InventoryGallery
