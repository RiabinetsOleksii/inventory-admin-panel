import { useEffect, useMemo, useState } from 'react'
import InventoryGallery from '../components/gallery/InventoryGallery'
import FavoritesBar from '../components/gallery/FavoritesBar'
import InventoryQuickView from '../components/gallery/InventoryQuickView'
import useFavorites from '../hooks/useFavorites'
import { getInventory } from '../services/inventoryApi'

function Favorites() {
	const [items, setItems] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')
	const [selectedItem, setSelectedItem] = useState(null)
	const { favoriteIds, favoriteCount, isFavorite, toggleFavorite } = useFavorites()

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
					setError(loadError instanceof Error ? loadError.message : 'Не вдалося завантажити улюблені')
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

	const favoriteItems = useMemo(
		() => favoriteIds.map((id) => items.find((item) => String(item.id) === String(id))).filter(Boolean),
		[favoriteIds, items],
	)

	return (
		<main className="gallery-page">
			<header className="gallery-header">
				<h1>Favorites</h1>
				<p>Items marked as favorite will appear here.</p>
			</header>

			<FavoritesBar count={favoriteCount} />
			{error ? <p className="gallery-error">{error}</p> : null}
			<InventoryGallery
				items={favoriteItems}
				favoriteIds={favoriteIds}
				isLoading={isLoading}
				emptyMessage="У вибраному поки що немає товарів."
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

export default Favorites
function Favorites() {
	return (
		<main className="gallery-page">
			<header className="gallery-header">
				<h1>Favorites</h1>
				<p>Items marked as favorite will appear here.</p>
			</header>
		</main>
	)
}

export default Favorites
