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
    const [demo, setDemo] = useState({
        type: '',
        status: false
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
        setUser({ ...user, auth: 'authenticating' })

        let ip = ''

        try {
            try {
                const ipResponse = await fetch('https://api.ipify.org/?format=json')
                if (ipResponse.ok) {
                    const ipData = await ipResponse.json()
                    ip = ipData.ip
                }
            } catch (ipError) {
                console.error('Failed to fetch IP address:', ipError)
            }

            const loginResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...credentials, ip })
            })

            const result = await loginResponse.json()

            if (result.success) {
                setUser({ ...result.data.user, auth: 'authenticated' })
                localStorage.setItem('token', result.data.token)
            } else {
                setError(result.message)
                setUser({ ...user, auth: 'failed' })
            }
        } catch (err) {
            setError(err.message || err.error || 'Something went wrong')
            setUser({ ...user, auth: 'failed' })
        }
    }

    const handleDemo = async (type) => {
        setError('')
        setDemo({ type, status: true })

        try {
            const demoResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/demo/${type}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })

            const result = await demoResponse.json()

            if (result.success) {
                setUser({ ...result.data.user, auth: 'authenticated' })
                localStorage.setItem('token', result.data.token)
            } else {
                setError(result.message)
                setUser({ ...user, auth: 'failed' })
            }
        } catch (err) {
            setError(err.message || err.error || 'Something went wrong')
            setDemo({ type, status: false })
        }
    }

    return (
        <>
            <form className='max-w-[500px] w-full mx-auto p-3 border' onSubmit={handleLognSubmit}>
                <h1 className='mb-2 sm:mb-2.5 text-2xl sm:text-3xl text-center'>Login</h1>

                <input
                    name='email'
                    className='w-full my-1.5 py-2 px-3 outline-none border-2 focus:border-black'
                    placeholder='Enter email address'
                    value={credentials.email}
                    onChange={handleChange}
                />

                <input
                    name='password'
                    className='w-full my-1.5 py-2 px-3 outline-none border-2 focus:border-black'
                    placeholder='Enter password'
                    value={credentials.password}
                    onChange={handleChange}
                />

                <div className='mt-1.5 flex flex-col gap-3'>
                    <button
                        type='submit'
                        className={`w-full py-2 px-3 flex justify-center ${user.auth === 'authenticating' ? 'bg-gray-300 cursor-not-allowed' : 'bg-black'} text-white`}
                        disabled={user.auth === 'authenticating'}
                    >
                        {user.auth === 'authenticating' ? <LoadingSVG size={24} color='#000' /> : 'Sign in'}
                    </button>

                    <div className='flex justify-between'>
                        <Link to='/signup' className='hover:underline'>Create Account</Link>
                        <Link to='/forgot-password' className='hover:underline'>Forgot Password</Link>
                    </div>

                    <div className='w-full border-t' />

                    <div className='flex gap-3'>
                        <button
                            type='button'
                            className={`w-full py-2 px-3 flex justify-center ${demo.type === 'admin' && demo.status ? 'bg-gray-300 cursor-not-allowed' : 'border border-black'}`}
                            disabled={demo.type === 'admin' && demo.status}
                            onClick={() => handleDemo('admin')}
                        >
                            {demo.type === 'admin' && demo.status ? <LoadingSVG size={24} color='#000' /> : 'Demo admin'}
                        </button>

                        <button
                            type='button'
                            className={`w-full py-2 px-3 flex justify-center ${demo.type === 'user' && demo.status ? 'bg-gray-300 cursor-not-allowed' : 'border border-black'}`}
                            disabled={demo.type === 'user' && demo.status}
                            onClick={() => handleDemo('user')}
                        >
                            {demo.type === 'user' && demo.status ? <LoadingSVG size={24} color='#000' /> : 'Demo user'}
                        </button>
                    </div>
                </div>
            </form>
            <p className='mt-3 text-center text-red-600'>{error}</p>
        </>
    )
}