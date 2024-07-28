import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { LoadingSVG } from '../components/loading'

export default function Signup() {
    const { user } = useAuthStore()

    if (user.authenticated === 'authenticating')
        return <div className='w-full flex justify-center'><LoadingSVG size={24} color='#000' /></div>
    return (
        <form className='max-w-[500px] w-full mx-auto p-3 border'>
            <h1 className='mb-2 md:mb-2.5 text-2xl md:text-3xl text-center'>Register</h1>

            <input
                className='w-full my-1.5 py-2 px-3 border'
                placeholder='Enter email address'
            />

            <input
                className='w-full my-1.5 py-2 px-3 border'
                placeholder='Enter password'
            />

            <input
                className='w-full my-1.5 py-2 px-3 border'
                placeholder='Confirm password'
            />

            <div className='mt-1.5 flex flex-col gap-3'>
                <button className='w-full bg-black text-white py-2 px-3'>
                    Create Account
                </button>

                <Link to='/login' className='w-fit group'>
                    Already have an account? <span className='group-hover:underline'>Login</span>
                </Link>
            </div>
        </form>
    )
}