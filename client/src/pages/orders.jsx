import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'

const Orders = () => {
    const { setUser } = useAuthStore()

    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token')
            if (!token) return setUser({ id: '', email: '', role: '', auth: 'failed' })

            await fetch(`${import.meta.env.VITE_SERVER_URL}/orders`, {
                method: 'GET',
                headers: { 'authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(response => {
                    if (response.success) setOrders(response.data)
                    else setOrders(null)
                })
        }
        fetchOrders()
    }, [])

    return (
        <div>Orders</div>
    )
}

export default Orders