import './App.css'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import handleAutoLogin from './utils/handleAutoLogin'
import Navbar from './components/navbar'
import Home from './pages/home'
import Admin from './pages/admin'
import Login from './pages/login'
import Signup from './pages/signup'
import ForgotPassword from './pages/forgot'

export default function App() {
  const { user, setUser } = useAuthStore()

  useEffect(() => {
    handleAutoLogin(user, setUser)
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