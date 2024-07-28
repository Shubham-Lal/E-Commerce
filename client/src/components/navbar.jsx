import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { LoadingSVG } from './loading'

const Navbar = () => {
    const { user, setUser } = useAuthStore()

    const handleLogout = async () => {
        setUser({ id: '', email: '', authenticated: 'failed' })
        localStorage.removeItem('token')
    }

    return (
        <header className='fixed top-0 left-0 w-full'>
            <nav className='max-w-[1920px] w-full h-[50px] mx-auto px-3 bg-white flex items-center justify-between border-b overflow-hidden'>
                <img
                    src='https://www.clawlaw.in/static/media/clawlogo.d83bac13ffbc974ac1e1.png'
                    alt='ecommerce | claw'
                    className='brightness-0 w-20 translate-y-1 -translate-x-1'
                />
                <div className='flex items-center gap-3 text-lg md:text-xl'>
                    <Link to='/' className='hover:underline'>HOME</Link>
                    {user.authenticated === 'authenticated' ? (
                        <button className='hover:underline' onClick={handleLogout}>LOGOUT</button>
                    ) : user.authenticated === 'authenticating' ? (
                        <LoadingSVG size={20} color='#000' />
                    ) : (
                        <>
                            <Link to='/login' className='hover:underline'>LOGIN</Link>
                            <Link to='/signup' className='hover:underline'>SIGNUP</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar