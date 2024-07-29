const handleFetchProducts = async (setProducts) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/products`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        const data = await response.json()
        if (data.success) {
            setProducts(data.data)
        } else {
            setProducts(null)
        }
    } catch (error) {
        setProducts(null)
    }
}

export default handleFetchProducts