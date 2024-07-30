const handleFetchSession = async (user, setUser) => {
    const token = localStorage.getItem('token')

    if (!token) {
        return setUser({ ...user, auth: 'failed' })
    }
    else {
        let ip = ''

        try {
            const ipResponse = await fetch('https://api.ipify.org/?format=json')
            if (ipResponse.ok) {
                const ipData = await ipResponse.json()
                ip = ipData.ip
            }
        } catch (ipError) {
            console.error('Failed to fetch IP address:', ipError)
        }

        await fetch(`${import.meta.env.VITE_SERVER_URL}/sessions`, {
            method: 'GET',
            headers: { 'authorization': `Bearer ${token}`, 'ip': ip }
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    setUser({ ...response.data.user, auth: 'authenticated' })
                }
                else {
                    setUser({ ...user, auth: 'failed' })
                    localStorage.removeItem('token')
                }
            })
    }
}

export default handleFetchSession