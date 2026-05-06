import { Link } from 'react-router-dom'

function FavoritesBar({ count = 0, onClearFavorites }) {
	return (
		<div className="favorites-bar">
			<p>
				Улюблених героїв: <strong>{count}</strong>
			</p>
			<div className="favorites-bar-actions">
				<Link to="/gallery">Галерея</Link>
				<Link to="/favorites">Улюблені</Link>
				<button type="button" onClick={onClearFavorites} disabled={count === 0}>
					Очистити
				</button>
			</div>
		</div>
	)
}

export default FavoritesBar
