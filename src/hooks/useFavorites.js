import { useEffect, useMemo, useState } from 'react'

const FAVORITES_STORAGE_KEY = 'inventory-favorites'

function readFavorites() {
	if (typeof window === 'undefined') {
		return []
	}

	try {
		const storedValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY)

		if (!storedValue) {
			return []
		}

		const parsedValue = JSON.parse(storedValue)
		return Array.isArray(parsedValue) ? parsedValue.map(String) : []
	} catch {
		return []
	}
}

export default function useFavorites() {
	const [favoriteIds, setFavoriteIds] = useState(() => readFavorites())

	useEffect(() => {
		if (typeof window === 'undefined') {
			return
		}

		window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds))
	}, [favoriteIds])

	const isFavorite = (id) => favoriteIds.includes(String(id))

	const toggleFavorite = (id) => {
		const normalizedId = String(id)

		setFavoriteIds((currentIds) =>
			currentIds.includes(normalizedId)
				? currentIds.filter((currentId) => currentId !== normalizedId)
				: [...currentIds, normalizedId],
		)
	}

	const favoriteCount = useMemo(() => favoriteIds.length, [favoriteIds])

	return {
		favoriteIds,
		favoriteCount,
		isFavorite,
		toggleFavorite,
	}
}