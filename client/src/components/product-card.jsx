import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useProductStore } from '../store/useProductStore'

const ProductCard = ({ data }) => {
    const navigate = useNavigate()

    const { user } = useAuthStore()
    const { cart, setCart } = useProductStore()

    const handleAddToCart = () => {
        if (user.auth !== 'authenticating') {
            if (user.auth === 'failed') navigate('/login')
            else {
                const existingProduct = cart.find(item => item._id === data._id)
                if (existingProduct) {
                    if (existingProduct.quantity < existingProduct.stock) {
                        setCart(cart.map(item =>
                            item._id === data._id ? { ...item, quantity: item.quantity + 1 } : item
                        ))
                    }
                } else {
                    setCart([...cart, { ...data, quantity: 1 }])
                }
            }
        }
    }

    return (
        <div className='mb-3 p-3 flex flex-col gap-3 break-inside-avoid border'>
            <h2 className='text-2xl font-medium'>{data.name}</h2>
            <p>{data.description}</p>
            <p className='flex justify-between'><span>₹{data.price}</span><span>{data.stock} left</span></p>
            <div className='flex gap-3'>
                <button className='w-full py-2 px-3 flex justify-center bg-black text-white'>
                    Buy
                </button>
                <button className='w-full py-2 px-3 flex justify-center border border-black' onClick={handleAddToCart}>
                    Add to Cart
                </button>
            </div>
        </div>
    )
}

export default ProductCard