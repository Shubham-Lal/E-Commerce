import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useProductStore } from '../store/useProductStore'
import { IoMdAdd } from 'react-icons/io'
import { RiSubtractFill } from 'react-icons/ri'
import { LoadingSVG } from './loading'

const Cart = () => {
    const { user, setUser } = useAuthStore()
    const { cart, setCart } = useProductStore()

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleIncreaseQuantity = (id) => {
        setCart({
            ...cart,
            status: 'fetched',
            items: cart.items.map(item =>
                item._id === id && item.quantity < item.stock ? { ...item, quantity: item.quantity + 1 } : item
            )
        })
    }

    const handleDecreaseQuantity = (id) => {
        setCart({
            ...cart,
            status: 'fetched',
            items: cart.items.reduce((acc, item) => {
                if (item._id === id) {
                    if (item.quantity > 1) {
                        acc.push({ ...item, quantity: item.quantity - 1 })
                    }
                } else {
                    acc.push(item)
                }
                return acc
            }, [])
        })
    }

    const calculateTotalAmount = () => {
        return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    const handleProceedCheckout = async () => {
        if (user.auth !== 'authenticating') {
            if (user.auth === 'failed') navigate('/login')
            else {
                setLoading(true)

                const token = localStorage.getItem('token')
                if (!token) return setUser({ id: '', email: '', role: '', auth: 'failed' })

                await fetch(`${import.meta.env.VITE_SERVER_URL}/orders`, {
                    method: 'POST',
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ cart: cart.items })
                })
                    .then(res => res.json())
                    .then(response => {
                        if (response.success) {
                            window.location.href = response.payement_url
                        }
                        else setError(response.message)
                    })
                    .catch(err => setError(err.message))
                    .finally(() => setLoading(false))
            }
        }
    }

    return (
        <div className='absolute top-[50px] right-0 sm:max-w-[400px] w-full max-h-[calc(100dvh-50px)] sm:h-[calc(100dvh-50px)] flex flex-col gap-3 p-3 bg-white text-black border shadow-lg sm:shadow-md select-none overflow-y-auto'>
            {cart.items.length === 0 ? <p className='text-gray-600'>Nothing in the cart</p> : (
                <>
                    {cart.items.map((item, id) => (
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
                    <button
                        className={`w-full py-2 px-3 flex justify-center ${loading ? 'bg-gray-300 cursor-not-allowed' : 'border border-black'}`}
                        onClick={handleProceedCheckout}
                        disabled={loading}
                    >
                        {loading ? <LoadingSVG size={24} color='#000' /> : 'Proceed to Checkout'}
                    </button>
                    <p className='mt-3 text-center text-red-600'>{error}</p>
                </>
            )}
        </div>
    )
}

export default Cart