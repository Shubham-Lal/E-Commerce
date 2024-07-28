const handleAutoLogin = async (user, setUser) => {
    const token = localStorage.getItem('token')

    if (!token) {
        return setUser({ ...user, auth: 'failed' })
    }
    else {
        let ip = 'none'

        try {
            const ipResponse = await fetch('https://api.ipify.org/?format=json')
            if (ipResponse.ok) {
                const ipData = await ipResponse.json()
                ip = ipData.ip
            }
        } catch (ipError) {
            console.error('Failed to fetch IP address:', ipError)
        }

        const headers = new Headers()
        headers.append('authorization', `Bearer ${token}`)
        headers.append('ip', ip)

        await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
            method: 'GET',
            headers: headers
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
            .catch(() => {
                setUser({ ...user, auth: 'failed' })
                localStorage.removeItem('token')
            })
    }
}

export default handleAutoLogin