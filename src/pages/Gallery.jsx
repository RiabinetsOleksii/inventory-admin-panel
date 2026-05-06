import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
	const { favoriteIds, favoriteCount, isFavorite, toggleFavorite, clearFavorites } = useFavorites()

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
				<div>
					<h1>Галерея героїв Dota</h1>
					<p>Клікай по картці, щоб відкрити quick view, або став серце в улюблені.</p>
				</div>
				<div className="gallery-header-actions">
					<span className="gallery-header-chip">Улюблених: {favoriteCount}</span>
					<Link className="gallery-header-link" to="/favorites">Переглянути улюблені</Link>
					<button type="button" className="gallery-header-link" onClick={clearFavorites} disabled={favoriteCount === 0}>
						Очистити
					</button>
				</div>
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
