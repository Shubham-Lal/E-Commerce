import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useProductStore } from '../store/useProductStore'
import { LoadingSVG } from './loading'
import { FaCircleUser } from 'react-icons/fa6'
import { FaShoppingCart } from 'react-icons/fa'
import { IoMdAdd } from 'react-icons/io'
import { RiSubtractFill } from 'react-icons/ri'

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
                    {user.auth === 'authenticated' ? (
                        <>
                            <button onClick={() => setDropdown(dropdown !== 2 ? 2 : 0)} className='flex items-center gap-1'>
                                <FaShoppingCart size={24} />
                                <p>{cart.length > 0 && cart.length}</p>
                            </button>
                            <button onClick={() => setDropdown(dropdown !== 1 ? 1 : 0)}>
                                <FaCircleUser size={25} />
                            </button>
                        </>
                    ) : user.auth === 'authenticating' ? (
                        <LoadingSVG size={25} color='#FFF' />
                    ) : (
                        <>
                            <Link to='/login' className='hover:underline'>LOGIN</Link>
                            <Link to='/signup' className='hover:underline'>SIGNUP</Link>
                        </>
                    )}
                </div>


                {dropdown === 1 ? (
                    <div className='absolute top-[49px] right-0 sm:max-w-[400px] w-full flex flex-col gap-3 p-3 bg-white text-black border shadow-lg sm:shadow-md'>
                        <p className='truncate font-semibold'>{user.email}</p>
                        <div className='w-full border-t' />
                        <button onClick={() => setDropdown(2)} className='w-fit hover:underline'>CART</button>
                        <button onClick={() => setDropdown(0)} className='w-fit hover:underline'>ORDERS</button>
                        <button onClick={handleLogout} className='w-fit hover:underline'>LOGOUT</button>
                    </div>
                ) : dropdown === 2 && <Cart />}
            </nav>
        </header>
    )
}

const Cart = () => {
    const { cart = [], setCart } = useProductStore()

    const handleIncreaseQuantity = (id) => {
        setCart(cart.map(item =>
            item._id === id && item.quantity < item.stock ? { ...item, quantity: item.quantity + 1 } : item
        ))
    }

    const handleDecreaseQuantity = (id) => {
        setCart(cart.reduce((acc, item) => {
            if (item._id === id) {
                if (item.quantity > 1) {
                    acc.push({ ...item, quantity: item.quantity - 1 })
                }
            } else {
                acc.push(item)
            }
            return acc
        }, []))
    }

    const calculateTotalAmount = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    return (
        <div className='absolute top-[50px] right-0 sm:max-w-[400px] w-full max-h-[calc(100dvh-50px)] sm:h-[calc(100dvh-50px)] flex flex-col gap-3 p-3 bg-white text-black border shadow-lg sm:shadow-md select-none overflow-y-auto'>
            {cart.length === 0 ? <p className='text-gray-600'>Nothing in the cart</p> : (
                <>
                    {cart.map((item, id) => (
                        <div key={id} className='flex flex-col'>
                            <p className='truncate text-xl font-semibold'>{item.name}</p>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2 text-xl'>
                                    <button onClick={() => handleDecreaseQuantity(item._id)}><RiSubtractFill size={18} /></button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleIncreaseQuantity(item._id)}><IoMdAdd size={18} /></button>
                                </div>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        </div>
                    ))}
                    <div className='w-full border-t' />
                    <div className='flex justify-between'>
                        <p>Total Amount</p>
                        <p>₹{calculateTotalAmount()}</p>
                    </div>
                    <button className='w-full py-2 px-3 flex justify-center border border-black'>Proceed to Checkout</button>
                </>
            )}
        </div>
    )
}


export default Navbar