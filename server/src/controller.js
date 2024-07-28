const supabase = require('./supabase')
const { AuthApiError } = require('@supabase/supabase-js')
const User = require('./models/User.js')
const Session = require('./models/Session.js')

module.exports.createUser = async (req, res) => {
    try {
        const { email, password, confirm_password } = req.body

        if (!email) return res.status(400).json({ success: false, message: 'Email is required' })
        else if (password.length < 6) return res.status(400).json({ success: false, message: 'Password should be atleast 6 characters' })
        else if (password !== confirm_password) return res.status(400).json({ success: false, message: 'Password does not match' })

        const { data, error } = await supabase.auth.signUp({
            email, password, options: { emailRedirectTo: `${process.env.FRONTEND_URL}/login` }
        })
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            return res.status(400).json({ success: false, message: 'Account already exists' })
        }
        if (error) {
            if (error.code === 'over_email_send_rate_limit') {
                return res.status(400).json({ success: false, message: 'Try again after some time' })
            }
            else throw error
        }

        await User.findOneAndUpdate(
            { email },
            { $setOnInsert: { _id: data.user.id, email, password } },
            { upsert: true, runValidators: true, setDefaultsOnInsert: true }
        )

        res.status(200).json({ success: true, message: 'Account verification sent to your mail' })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.verifyUser = async (req, res) => {
    try {
        const { email, password, ip } = req.body

        if (!email) return res.status(400).json({ success: false, message: 'Email is required' })
        else if (!password) return res.status(400).json({ success: false, message: 'Password is required' })
        else if (!ip) return res.status(400).json({ success: false, message: 'Failed to get IP' })

        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            if (error instanceof AuthApiError) {
                return res.status(400).json({ success: false, message: error.message })
            }
            throw err
        }

        const user = await User.findById(data.user.id)
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' })
        }

        await Session.findOneAndUpdate(
            { user_id: data.user.id },
            {
                $push: {
                    login: { timestamp: data.user.last_sign_in_at, ip }
                }
            },
            { upsert: true, new: true, runValidators: true }
        )

        res.status(200).json({
            success: true,
            message: 'Login success',
            data: {
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    role: user.role
                },
                token: data.session.access_token
            }
        })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.autoLogin = async (req, res) => {
    try {
        await Session.findOneAndUpdate(
            { user_id: req.user.id },
            {
                $push: {
                    login: {
                        timestamp: req.user.last_sign_in_at,
                        ip: req.headers['ip']
                    }
                }
            },
            { upsert: true, new: true, runValidators: true }
        )

        res.status(200).json({
            success: true,
            message: 'Login success',
            data: {
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.user_role
                }
            }
        })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.createProduct = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.fetchProducts = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.updateProduct = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.updateCart = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.fetchCart = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.createOrder = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.fetchOrders = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.fetchSessions = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.processPayment = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}