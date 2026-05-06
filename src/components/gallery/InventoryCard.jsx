function getItemImage(item) {
	return item?.imageUrl || item?.photoUrl || item?.previewUrl || item?.image || ''
}

function InventoryCard({ item }) {
	const imageSrc = getItemImage(item)

	return (
		<article className="inventory-card">
			{imageSrc ? (
				<img src={imageSrc} alt={item.name} className="inventory-card-image" />
			) : (
				<div className="inventory-card-placeholder">Немає фото</div>
			)}

			<div className="inventory-card-content">
				<h2>{item.name}</h2>
				<p>{item.description || 'Опис відсутній'}</p>
			</div>
		</article>
	)
}

export default InventoryCard
