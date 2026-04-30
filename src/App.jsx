import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminInventory from './pages/AdminInventory'
import AdminInventoryCreate from './pages/AdminInventoryCreate'
import AdminInventoryEdit from './pages/AdminInventoryEdit'
import AdminInventoryDetails from './pages/AdminInventoryDetails'
import { InventoryProvider } from './store/InventoryContext'
import './App.css'

function App() {
  return (
    <InventoryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminInventory />} />
          <Route path="/create" element={<AdminInventoryCreate />} />
          <Route path="/details/:id" element={<AdminInventoryDetails />} />
          <Route path="/edit/:id" element={<AdminInventoryEdit />} />
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
