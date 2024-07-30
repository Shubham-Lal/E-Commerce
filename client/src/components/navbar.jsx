import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useProductStore } from '../store/useProductStore'
import { LoadingSVG } from './loading'
import { FaCircleUser } from 'react-icons/fa6'
import { FaShoppingCart } from 'react-icons/fa'
import Cart from './cart'

const Navbar = () => {
    const location = useLocation()

    const { user, setUser } = useAuthStore()
    const { cart } = useProductStore()

    const [dropdown, setDropdown] = useState(0)

    const handleLogout = async () => {
        setDropdown(0)
        setUser({ id: '', email: '', role: '', auth: 'failed' })
        localStorage.removeItem('token')
    }

    return (
        <header className='fixed top-0 left-0 z-10 w-full'>
            <nav className='realtive max-w-[1920px] w-full h-[50px] mx-auto px-3 bg-black text-white flex items-center justify-between'>
                <Link to='/' onClick={() => setDropdown(0)}>
                    <img
                        src='https://www.clawlaw.in/static/media/clawlogo.d83bac13ffbc974ac1e1.png'
                        alt='ecommerce | claw'
                        className='w-20 translate-y-1 -translate-x-1'
                    />
                </Link>
                <div className='relative flex items-center gap-3 text-lg sm:text-xl'>
                    <Link
                        to='/'
                        className={location.pathname === '/' ? 'underline' : 'hover:underline'}
                        onClick={() => setDropdown(0)}
                    >
                        HOME
                    </Link>
                    {user.role === 'admin' && (
                        <Link
                            to='/admin'
                            className={location.pathname === '/admin' ? 'underline' : 'hover:underline'}
                            onClick={() => setDropdown(0)}
                        >
                            ADMIN
                        </Link>
                    )}
                    {location.pathname === '/' && user.auth === 'authenticating' ? (
                        <LoadingSVG size={25} color='#FFF' />
                    ) : user.auth === 'authenticated' ? (
                        <>
                            <button onClick={() => setDropdown(dropdown !== 2 ? 2 : 0)} className='flex items-center gap-1'>
                                <FaShoppingCart size={24} />
                                <p>{cart.items.length > 0 && cart.items.length}</p>
                            </button>
                            <button onClick={() => setDropdown(dropdown !== 1 ? 1 : 0)}>
                                <FaCircleUser size={25} />
                            </button>
                        </>
                    ) : user.auth === 'failed' && (
                        <>
                            <Link to='/login' className={location.pathname === '/login' ? 'underline' : 'hover:underline'}>LOGIN</Link>
                            <Link to='/signup' className={location.pathname === '/signup' ? 'underline' : 'hover:underline'}>SIGNUP</Link>
                        </>
                    )}
                </div>


                {dropdown === 1 ? (
                    <div className='absolute top-[49px] right-0 sm:max-w-[400px] w-full flex flex-col gap-3 p-3 bg-white text-black border shadow-lg sm:shadow-md'>
                        <p className='truncate font-semibold'>{user.email}</p>
                        <div className='w-full border-t' />
                        <button onClick={() => setDropdown(2)} className='w-fit hover:underline'>CART {cart.items.length > 0 && `(${cart.items.length})`}</button>
                        <Link to='/orders' onClick={() => setDropdown(0)} className='w-fit hover:underline'>ORDERS</Link>
                        <button onClick={handleLogout} className='w-fit hover:underline'>LOGOUT</button>
                    </div>
                ) : dropdown === 2 && <Cart />}
            </nav>
        </header>
    )
}

export default Navbar