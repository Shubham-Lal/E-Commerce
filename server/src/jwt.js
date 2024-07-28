const supabase = require('./supabase')
const { AuthApiError } = require('@supabase/supabase-js')
const User = require('./models/User.js')

module.exports = async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Missing or invalid Bearer token.' })
    }

    const token = authHeader.slice(7)

    try {
        const { data, error } = await supabase.auth.getUser(token)
        if (error) {
            if (error instanceof AuthApiError) {
                return res.status(400).json({ success: false, message: error.message })
            }
            throw error
        }

        const user = await User.findById(data.user.id)
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' })
        }

        data.user.user_role = user.role
        req.user = data.user
        next()
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}