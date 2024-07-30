import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useProductStore } from '../store/useProductStore'
import { LoadingSVG } from './loading'

const ProductCard = ({ data }) => {
    const navigate = useNavigate()

    const { user, setUser } = useAuthStore()
    const { cart, setCart } = useProductStore()

    const [loading, setLoading] = useState('')
    const [error, setError] = useState(false)

    const handleAddToCart = () => {
        if (user.auth !== 'authenticating') {
            if (user.auth === 'failed') navigate('/login')
            else {
                const existingProduct = cart.items.find(item => item._id === data._id)
                if (existingProduct) {
                    if (existingProduct.quantity < existingProduct.stock) {
                        setCart({
                            ...cart,
                            status: 'fetched',
                            items: cart.items.map(item =>
                                item._id === data._id ? { ...item, quantity: item.quantity + 1 } : item
                            )
                        })
                    }
                } else {
                    setCart({
                        ...cart,
                        status: 'fetched',
                        items: [...cart.items, { ...data, quantity: 1 }]
                    })
                }
            }
        }
    }

    const handleBuy = async () => {
        if (user.auth !== 'authenticating') {
            if (user.auth === 'failed') navigate('/login')
            else {
                setError('')
                setLoading(data._id)

                const token = localStorage.getItem('token')
                if (!token) return setUser({ id: '', email: '', role: '', auth: 'failed' })

                await fetch(`${import.meta.env.VITE_SERVER_URL}/orders`, {
                    method: 'POST',
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ cart: [{ ...data, quantity: 1 }] })
                })
                    .then(res => res.json())
                    .then(response => {
                        if (response.success) {
                            window.location.href = response.payement_url
                        }
                        else setError(response.message)
                    })
                    .catch(err => setError(err.message))
                    .finally(() => setLoading(''))
            }
        }
    }

    return (
        <div className='mb-3 p-3 flex flex-col gap-3 break-inside-avoid border'>
            <h2 className='text-2xl font-medium'>{data.name}</h2>
            <p>{data.description}</p>
            <p className='flex justify-between'><span>₹{data.price}</span><span>{data.stock} left</span></p>
            <div className='flex gap-3'>
                <button className='w-full py-2 px-3 flex justify-center border border-black' onClick={handleAddToCart}>
                    Add to Cart
                </button>
                <button
                    className={`w-full py-2 px-3 flex justify-center ${loading === data._id ? 'bg-gray-300 cursor-not-allowed' : 'bg-black'} text-white`}
                    onClick={handleBuy}
                    disabled={loading === data._id}
                >
                    {loading === data._id ? <LoadingSVG size={24} color='#000' /> : 'Buy'}
                </button>
            </div>
            <p className='text-center text-red-600'>{error}</p>
        </div>
    )
}

export default ProductCard