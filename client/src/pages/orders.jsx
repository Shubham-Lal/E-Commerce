import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { LoadingSVG } from '../components/loading'

const Orders = () => {
    const { setUser } = useAuthStore()

    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token')
            if (!token) return setUser({ id: '', email: '', role: '', auth: 'failed' })

            setLoading(true)

            await fetch(`${import.meta.env.VITE_SERVER_URL}/orders`, {
                method: 'GET',
                headers: { 'authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(response => {
                    if (response.success) setOrders(response.data)
                    else setOrders(null)
                })
                .finally(() => setLoading(false))
        }
        fetchOrders()
    }, [])

    if (loading)
        return <div className='w-full flex justify-center'><LoadingSVG size={24} color='#000' /></div>
    return (
        <div className='flex flex-col gap-3'>
            {orders === null || orders === undefined || !orders.length ? <p>No orders yet</p>
                : orders.map((order, o_id) => (
                    <div key={o_id} className='p-3 flex flex-col gap-3 border'>
                        <h1 className='font-semibold'>Order ID #{order._id}</h1>
                        {order.products.map((product, p_id) => (
                            <div key={p_id}>
                                <h2 className='text-xl font-medium'>{p_id + 1}. {product._id.name}</h2>
                                <p className='pl-5'>{product.quantity} {product.quantity > 1 ? 'units' : 'unit'} x ₹{product._id.price}</p>
                            </div>
                        )
                        )}
                        <p>Total Amount: ₹{order.total_amount}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default Orders