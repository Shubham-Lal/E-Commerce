import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { LoadingSVG } from '../components/loading'

export default function ForgotPassword() {
    const { user } = useAuthStore()

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState({
        type: '',
        message: ''
    })

    const handleRecoverAccount = async (e) => {
        e.preventDefault()

        setStatus({ type: '', message: '' })
        setLoading(true)

        await fetch(`${import.meta.env.VITE_SERVER_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    setStatus({ type: 'success', message: response.message })
                } else {
                    setStatus({ type: 'error', message: response.message })
                }
            })
            .catch(err => setStatus({ type: 'error', message: err.message || err.error || 'Something went wrong' }))
            .finally(() => setLoading(''))
    }

    if (user.auth === 'authenticating')
        return <div className='w-full flex justify-center'><LoadingSVG size={24} color='#000' /></div>
    return (
        <>
            <form className='max-w-[500px] w-full mx-auto p-3 flex flex-col gap-3 border' onSubmit={handleRecoverAccount}>
                <h1 className='text-2xl sm:text-3xl text-center'>Forgot Password</h1>

                <input
                    className='w-full mt-1 py-2 px-3 outline-none border-2 focus:border-black'
                    placeholder='Enter email address'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <button className={`w-full py-2 px-3 flex justify-center ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-black'} text-white`}>
                    {loading ? <LoadingSVG size={24} color='#000' /> : 'Send Verification'}
                </button>

                <Link to='/login' className='hover:underline'>Go Back</Link>
            </form>
            <p className={`mt-3 text-center ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {status.message}
            </p>
        </>
    )
}