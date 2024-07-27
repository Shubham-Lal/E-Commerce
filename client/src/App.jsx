import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import Navbar from './components/navbar'
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import ForgotPassword from './pages/forgot'

export default function App() {
  const { user } = useAuthStore()

  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/login' element={user.authenticated ? <Navigate to='/' /> : <Login />} />
          <Route path='/signup' element={user.authenticated ? <Navigate to='/' /> : <Signup />} />
          <Route path='/forgot-password' element={user.authenticated ? <Navigate to='/' /> : <ForgotPassword />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}