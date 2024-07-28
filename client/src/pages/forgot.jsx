import { useAuthStore } from '../store/useAuthStore'
import { LoadingSVG } from '../components/loading'

export default function ForgotPassword() {
    const { user } = useAuthStore()

    if (user.authenticated === 'authenticating')
        return <div className='w-full flex justify-center'><LoadingSVG size={24} color='#000' /></div>
    return (
        <form className='max-w-[500px] w-full mx-auto p-3 border'>
            <h1 className='mb-2 md:mb-2.5 text-2xl md:text-3xl text-center'>Forgot Password</h1>

            <input
                className='w-full my-1.5 py-2 px-3 border'
                placeholder='Enter email address'
            />

            <button className='mt-1.5 w-full bg-black text-white py-2 px-3'>
                Send Verification
            </button>
        </form>
    )
}