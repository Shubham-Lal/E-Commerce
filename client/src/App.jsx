import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import ForgotPassword from './pages/forgot'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}