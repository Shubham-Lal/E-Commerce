import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { LoadingSVG } from '../components/loading'

export default function Login() {
    const { user, setUser } = useAuthStore()

    const [error, setError] = useState('')
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value
        }))
    }

    const handleLognSubmit = async (e) => {
        e.preventDefault()

        setError('')
        setUser({ ...user, authenticated: 'authenticating' })

        try {
            const ipResponse = await fetch('https://api.ipify.org/?format=json')
            const ipData = await ipResponse.json()

            const loginResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...credentials, ip: ipData.ip })
            })

            const result = await loginResponse.json()

            if (result.success) {
                setUser({ ...result.data.user, authenticated: 'authenticated' })
                localStorage.setItem('token', result.data.token)
            } else {
                setError(result.message)
                setUser({ ...user, authenticated: 'failed' })
            }
        } catch (err) {
            setError(err.message || err.error || 'Something went wrong')
            setUser({ ...user, authenticated: 'failed' })
        }
    }

    return (
        <>
            <form className='max-w-[500px] w-full mx-auto p-3 border' onSubmit={handleLognSubmit}>
                <h1 className='mb-2 md:mb-2.5 text-2xl md:text-3xl text-center'>Login</h1>

                <input
                    name='email'
                    className='w-full my-1.5 py-2 px-3 border'
                    placeholder='Enter email address'
                    value={credentials.email}
                    onChange={handleChange}
                />

                <input
                    name='password'
                    className='w-full my-1.5 py-2 px-3 border'
                    placeholder='Enter password'
                    value={credentials.password}
                    onChange={handleChange}
                />

                <div className='mt-1.5 flex flex-col gap-3'>
                    <button
                        className={`w-full py-2 px-3 flex justify-center ${user.authenticated === 'authenticating' ? 'bg-gray-300 cursor-not-allowed' : 'bg-black'} text-white`}
                        disabled={user.authenticated === 'authenticating'}
                    >
                        {user.authenticated === 'authenticating' ? <LoadingSVG size={24} color='#000' /> : 'Sign in'}
                    </button>

                    <div className='flex justify-between'>
                        <Link to='/signup' className='hover:underline'>Create Account</Link>
                        <Link to='/forgot-password' className='hover:underline'>Forgot Password</Link>
                    </div>
                </div>
            </form>
            <p className='mt-3 text-center text-red-600'>{error}</p>
        </>
    )
}