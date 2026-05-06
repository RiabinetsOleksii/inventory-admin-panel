import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminInventory from './pages/AdminInventory'
import AdminInventoryCreate from './pages/AdminInventoryCreate'
import AdminInventoryEdit from './pages/AdminInventoryEdit'
import AdminInventoryDetails from './pages/AdminInventoryDetails'
import Gallery from './pages/Gallery'
import Favorites from './pages/Favorites'
import { InventoryProvider } from './store/InventoryContext'
import './App.css'

function App() {
  return (
    // Глобальний провайдер стану + маршрути адмін-інвентарю.
    // Так однакові дані доступні для списку, деталей, створення та редагування.
    <InventoryProvider>
      <BrowserRouter>
        <Routes>
          {/* Основні сторінки */}
          <Route path="/" element={<Gallery />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/create" element={<AdminInventoryCreate />} />
          <Route path="/details/:id" element={<AdminInventoryDetails />} />
          <Route path="/edit/:id" element={<AdminInventoryEdit />} />

          {/* Старі admin-адреси залишені як запасні переходи */}
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/inventory/create" element={<AdminInventoryCreate />} />
          <Route path="/admin/inventory/:id" element={<AdminInventoryDetails />} />
          <Route path="/admin/inventory/:id/edit" element={<AdminInventoryEdit />} />
        </Routes>
      </BrowserRouter>
    </InventoryProvider>
  )
}

export default App
