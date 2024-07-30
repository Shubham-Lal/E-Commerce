const handleFetchProducts = async (setProducts) => {
    try {
        setProducts({ status: 'fetching', items: [] })
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/products`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        const data = await response.json()
        if (data.success) {
            setProducts({ status: 'fetched', items: data.data })
        } else {
            setProducts({ status: 'failed', items: [] })
        }
    } catch (error) {
        setProducts({ status: 'failed', items: [] })
    }
}

export default handleFetchProducts