import { useEffect, useState } from 'react'
import InventoryGallery from '../components/gallery/InventoryGallery'
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
			<InventoryGallery
				items={items}
				favoriteIds={favoriteIds}
				isLoading={isLoading}
				onToggleFavorite={toggleFavorite}
				onSelect={(item) => setSelectedItem(item)}
			/>

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
