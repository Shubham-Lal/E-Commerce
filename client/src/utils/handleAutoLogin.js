const handleAutoLogin = async (user, setUser) => {
    const token = localStorage.getItem('token')

    if (!token) {
        return setUser({ ...user, authenticated: 'failed' })
    }
    else {
        const ipResponse = await fetch('https://api.ipify.org/?format=json')
        const ipData = await ipResponse.json()

        const headers = new Headers()
        headers.append('authorization', `Bearer ${token}`)
        headers.append('ip', ipData.ip)

        await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
            method: 'GET',
            headers: headers,
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    setUser({ ...response.data.user, authenticated: 'authenticated' })
                }
                else {
                    setUser({ ...user, authenticated: 'failed' })
                    localStorage.removeItem('token')
                }
            })
            .catch(() => {
                setUser({ ...user, authenticated: 'failed' })
                localStorage.removeItem('token')
            })
    }
}

export default handleAutoLogin