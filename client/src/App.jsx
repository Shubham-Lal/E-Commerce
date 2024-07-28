import './App.css'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import handleAutoLogin from './utils/handleAutoLogin'
import Navbar from './components/navbar'
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import ForgotPassword from './pages/forgot'

export default function App() {
  const { user, setUser } = useAuthStore()

  useEffect(() => {
    handleAutoLogin(user, setUser)
  }, [])

  console.log(user)

  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/login' element={user.auth !== 'authenticated' ? <Login /> : <Navigate to='/' />} />
          <Route path='/signup' element={user.auth !== 'authenticated' ? <Signup /> : <Navigate to='/' />} />
          <Route path='/forgot-password' element={user.auth !== 'authenticated' ? <ForgotPassword /> : <Navigate to='/' />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}