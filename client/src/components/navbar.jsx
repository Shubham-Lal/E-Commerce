import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { LoadingSVG } from './loading'
import { FaCircleUser } from 'react-icons/fa6'

const Navbar = () => {
    const { user, setUser } = useAuthStore()

    const [dropdown, setDropdown] = useState(false);

    const handleLogout = async () => {
        setDropdown(false)
        setUser({ id: '', email: '', role: '', auth: 'failed' })
        localStorage.removeItem('token')
    }

    return (
        <header className='fixed top-0 left-0 w-full'>
            <nav className='realtive max-w-[1920px] w-full h-[50px] mx-auto px-3 bg-white flex items-center justify-between border-b'>
                <img
                    src='https://www.clawlaw.in/static/media/clawlogo.d83bac13ffbc974ac1e1.png'
                    alt='ecommerce | claw'
                    className='brightness-0 w-20 translate-y-1 -translate-x-1'
                />
                <div className='relative flex items-center gap-3 text-lg sm:text-xl'>
                    <Link to='/' className='hover:underline' onClick={() => setDropdown(false)}>HOME</Link>
                    {user.auth === 'authenticated' ? (
                        <button onClick={() => setDropdown(!dropdown)}>
                            <FaCircleUser size={25} />
                        </button>
                    ) : user.auth === 'authenticating' ? (
                        <LoadingSVG size={25} color='#000' />
                    ) : (
                        <>
                            <Link to='/login' className='hover:underline'>LOGIN</Link>
                            <Link to='/signup' className='hover:underline'>SIGNUP</Link>
                        </>
                    )}
                </div>


                {dropdown && user.auth === 'authenticated' && (
                    <div className='absolute top-[49px] right-0 sm:right-3 sm:max-w-[300px] w-full flex flex-col gap-3 p-3 bg-white border shadow-lg sm:shadow-md'>
                        <p className='truncate font-semibold'>{user.email}</p>
                        <div className='w-full border-t' />
                        <button onClick={handleLogout} className='w-fit hover:underline'>LOGOUT</button>
                    </div>
                )}
            </nav>
        </header>
    )
}

export default Navbar