import { useLocation, Link } from 'react-router-dom'

const ErrorPage = () => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const errorMessage = queryParams.get('message') || 'An unexpected error occurred'

    return (
        <div className='flex flex-col gap-3'>
            <h1 className='text-2xl'>Error</h1>
            <p>{decodeURIComponent(errorMessage)}</p>
            <Link to='/' className='w-fit py-2 px-3 flex justify-center bg-black text-white'>
                Go back to Home
            </Link>
        </div>
    )
}

export default ErrorPage