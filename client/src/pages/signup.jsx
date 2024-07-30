import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { LoadingSVG } from '../components/loading'

export default function Signup() {
    const { user } = useAuthStore()

    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({
        type: '',
        message: ''
    })
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        confirm_password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value
        }))
    }

    const handleSignupSubmit = async (e) => {
        e.preventDefault()

        setStatus({ type: '', message: '' })
        setLoading(true)

        try {
            const signupResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            })

            const result = await signupResponse.json()

            if (result.success) {
                setCredentials({ email: '', password: '', confirm_password: '' })
                setStatus({ type: 'success', message: result.message })
            } else {
                setStatus({ type: 'error', message: result.message })
            }
        }
        catch (err) {
            setStatus({ type: 'error', message: err.message || err.error || 'Something went wrong' })
        }
        finally { setLoading(false) }
    }

    if (user.auth === 'authenticating')
        return <div className='w-full flex justify-center'><LoadingSVG size={24} color='#000' /></div>
    return (
        <>
            <form className='max-w-[500px] w-full mx-auto p-3 border' onSubmit={handleSignupSubmit}>
                <h1 className='mb-2 sm:mb-2.5 text-2xl sm:text-3xl text-center'>Register</h1>

                <input
                    name='email'
                    className='w-full my-1.5 py-2 px-3 outline-none border-2 focus:border-black'
                    placeholder='Enter email address'
                    onChange={handleChange}
                />

                <input
                    name='password'
                    className='w-full my-1.5 py-2 px-3 outline-none border-2 focus:border-black'
                    placeholder='Enter password'
                    onChange={handleChange}
                />

                <input
                    name='confirm_password'
                    className='w-full my-1.5 py-2 px-3 outline-none border-2 focus:border-black'
                    placeholder='Confirm password'
                    onChange={handleChange}
                />

                <div className='mt-1.5 flex flex-col gap-3'>
                    <button
                        className={`w-full py-2 px-3 flex justify-center ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-black'} text-white`}
                    >
                        {loading ? <LoadingSVG size={24} color='#000' /> : 'Create Account'}
                    </button>

                    <Link to='/login' className='w-fit group'>
                        Already have an account? <span className='group-hover:underline'>Login</span>
                    </Link>
                </div>
            </form>
            <p className={`mt-3 text-center ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {status.message}
            </p>
        </>
    )
}