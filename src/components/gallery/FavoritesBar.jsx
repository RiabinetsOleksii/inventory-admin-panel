function FavoritesBar({ count = 0 }) {
	return (
		<div className="favorites-bar">
			<p>
				Улюблених товарів: <strong>{count}</strong>
			</p>
		</div>
	)
}

export default FavoritesBar
