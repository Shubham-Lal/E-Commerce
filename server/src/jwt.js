const supabase = require('./supabase')
const { AuthApiError } = require('@supabase/supabase-js')

module.exports = async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Missing or invalid Bearer token.' })
    }

    const token = authHeader.slice(7)

    try {
        const { data, error } = await supabase.auth.getUser(token)
        if (error) {
            if (error instanceof AuthApiError && error.code === 'bad_jwt') {
                return res.status(400).json({ success: false, message: 'Invalid token' })
            }
            throw error
        }

        req.data = data
        next()
    } catch (error) {
        return res.status(500).json({ error })
    }
}