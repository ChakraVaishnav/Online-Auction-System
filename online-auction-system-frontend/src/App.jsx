import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ProductView from './pages/ProductView'
import AllProducts from './pages/AllProducts'
import MyProducts from './pages/MyProducts'
import Profile from './pages/Profile'
import { Navigate } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Navigate to="/dashboard/all" replace />} />
        <Route path="/dashboard/all" element={<AllProducts />} />
        <Route path="/dashboard/mine" element={<MyProducts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:id" element={<ProductView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
