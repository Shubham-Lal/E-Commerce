import './App.css'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { useProductStore } from './store/useProductStore'
import handleAutoLogin from './utils/handleAutoLogin'
import handleFetchProducts from './utils/handleFetchProducts'
import Navbar from './components/navbar'
import Home from './pages/home'
import Orders from './pages/orders'
import Admin from './pages/admin'
import Login from './pages/login'
import Signup from './pages/signup'
import ForgotPassword from './pages/forgot'
import Error from './pages/error'

export default function App() {
  const { user, setUser } = useAuthStore()
  const { setProducts } = useProductStore()

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        handleAutoLogin(user, setUser),
        handleFetchProducts(setProducts)
      ])
    }
    fetchData()
  }, [])

  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/orders' element={user.auth !== 'authenticated' ? <Login /> : <Orders />} />
          <Route path='/admin' element={user.auth !== 'authenticated' ? <Login /> : user.role === 'admin' ? <Admin /> : <Navigate to='/' />} />
          <Route path='/login' element={user.auth !== 'authenticated' ? <Login /> : user.role === 'admin' ? <Navigate to='/admin' /> : <Navigate to='/' />} />
          <Route path='/signup' element={user.auth !== 'authenticated' ? <Signup /> : <Navigate to='/' />} />
          <Route path='/forgot-password' element={user.auth !== 'authenticated' ? <ForgotPassword /> : <Navigate to='/' />} />
          <Route path='/error' element={<Error />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}