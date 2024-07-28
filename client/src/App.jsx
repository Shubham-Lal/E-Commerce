import './App.css'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { useProductStore } from './store/useProductStore'
import handleAutoLogin from './utils/handleAutoLogin'
import Navbar from './components/navbar'
import Home from './pages/home'
import Admin from './pages/admin'
import Login from './pages/login'
import Signup from './pages/signup'
import ForgotPassword from './pages/forgot'

export default function App() {
  const { user, setUser } = useAuthStore()
  const { cart, setProducts } = useProductStore()
  // console.log(cart)

  useEffect(() => {
    handleAutoLogin(user, setUser)

    const fetchProducts = async () => {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/products`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .then(response => {
          if (response.success) setProducts(response.data)
          else setProducts(null)
        })
        .catch(() => setProducts(null))
    }
    fetchProducts()
  }, [])

  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/admin' element={user.auth !== 'authenticated' ? <Login /> : user.role === 'admin' ? <Admin /> : <Navigate to='/' />} />
          <Route path='/login' element={user.auth !== 'authenticated' ? <Login /> : user.role === 'admin' ? <Navigate to='/admin' /> : <Navigate to='/' />} />
          <Route path='/signup' element={user.auth !== 'authenticated' ? <Signup /> : <Navigate to='/' />} />
          <Route path='/forgot-password' element={user.auth !== 'authenticated' ? <ForgotPassword /> : <Navigate to='/' />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}