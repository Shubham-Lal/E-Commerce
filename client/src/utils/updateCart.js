export const handleUpdateCart = async (cart, setUser) => {
    const token = localStorage.getItem('token')
    if (!token) return setUser({ id: '', email: '', role: '', auth: 'failed' })

    try {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/cart`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart: cart.items })
        })
    } catch (err) {
        console.error('Failed to update cart:', err)
    }
}
