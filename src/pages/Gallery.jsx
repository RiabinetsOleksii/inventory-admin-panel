import { useEffect, useState } from 'react'
import InventoryCard from '../components/gallery/InventoryCard'
import InventoryQuickView from '../components/gallery/InventoryQuickView'
import useFavorites from '../hooks/useFavorites'
import { getInventory } from '../services/inventoryApi'

function Gallery() {
	const [items, setItems] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')
	const [selectedItem, setSelectedItem] = useState(null)
	const { favoriteIds, isFavorite, toggleFavorite } = useFavorites()

	useEffect(() => {
		let isActive = true

		const loadInventory = async () => {
			try {
				const inventory = await getInventory()
				const normalizedItems = Array.isArray(inventory) ? inventory : inventory?.items || []

				if (isActive) {
					setItems(normalizedItems)
					setError('')
				}
			} catch (loadError) {
				if (isActive) {
					setError(loadError instanceof Error ? loadError.message : 'Не вдалося завантажити галерею')
				}
			} finally {
				if (isActive) {
					setIsLoading(false)
				}
			}
		}

		loadInventory()

		return () => {
			isActive = false
		}
	}, [])

	return (
		<main className="gallery-page">
			<header className="gallery-header">
				<h1>Gallery</h1>
				<p>Inventory items displayed in a responsive grid.</p>
			</header>

			{error ? <p className="gallery-error">{error}</p> : null}
			{isLoading ? (
				<p>Loading inventory...</p>
			) : (
				<section className="inventory-grid">
					{items.map((item) => (
						<InventoryCard
							key={item.id}
							item={item}
							isFavorite={isFavorite(item.id)}
							onToggleFavorite={toggleFavorite}
							onSelect={() => setSelectedItem(item)}
						/>
					))}
				</section>
			)}

			<InventoryQuickView
				item={selectedItem}
				isFavorite={selectedItem ? isFavorite(selectedItem.id) : false}
				onToggleFavorite={toggleFavorite}
				onClose={() => setSelectedItem(null)}
			/>
		</main>
	)
}

export default Gallery
