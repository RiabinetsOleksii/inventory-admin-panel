import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminInventory from './pages/AdminInventory'
import AdminInventoryCreate from './pages/AdminInventoryCreate'
import AdminInventoryDetails from './pages/AdminInventoryDetails'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/inventory" replace />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/inventory/create" element={<AdminInventoryCreate />} />
        <Route path="/admin/inventory/:id" element={<AdminInventoryDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
