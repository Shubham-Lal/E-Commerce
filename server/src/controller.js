const supabase = require('./supabase')
const { AuthApiError } = require('@supabase/supabase-js')
const User = require('./models/User.js')
const Session = require('./models/Session.js')

module.exports.createUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email) return res.status(400).json({ message: 'Email is required' })
        else if (!password) return res.status(400).json({ message: 'Password is required' })
        else if (password.length < 6) return res.status(400).json({ message: 'Password should be atleast 6 characters' })

        const { data, error } = await supabase.auth.signUp({
            email, password, options: {
                emailRedirectTo: `${process.env.FRONTEND_URL}/login`
            }
        })
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            return res.status(400).json({ error: 'Account already exists' })
        }
        if (error) {
            if (error.code === 'over_email_send_rate_limit') {
                return res.status(400).json({ error: 'Try again after some time' })
            }
            else throw error
        }

        await User.findOneAndUpdate(
            { email },
            { $setOnInsert: { _id: data.user.id, email, password } },
            { upsert: true, runValidators: true, setDefaultsOnInsert: true }
        )

        res.status(200).json({ message: 'Account verification sent to your mail' })
    }
    catch (error) {
        return res.status(500).json({ error })
    }
}

module.exports.verifyUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email) return res.status(400).json({ success: false, message: 'Email is required' })
        else if (!password) return res.status(400).json({ success: false, message: 'Password is required' })

        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            if (error instanceof AuthApiError && error.status === 400) {
                return res.status(400).json({ success: false, message: 'Invalid email or password' })
            }
            else throw err
        }

        await Session.findOneAndUpdate(
            { user_id: data.user.id },
            {
                $push: {
                    login: {
                        timestamp: data.user.last_sign_in_at,
                        ip: req.ip.split(':').slice(-1)[0]
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
                    id: data.user.id,
                    email: data.user.email
                },
                token: data.session.access_token
            }
        })
    }
    catch (error) {
        return res.status(500).json({ error })
    }
}

module.exports.createProduct = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ error })
    }
}

module.exports.fetchProducts = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ error })
    }
}

module.exports.updateProduct = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ error })
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ error })
    }
}

module.exports.updateCart = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ error })
    }
}

module.exports.fetchCart = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ error })
    }
}

module.exports.createOrder = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ error })
    }
}

module.exports.fetchOrders = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ error })
    }
}

module.exports.fetchSessions = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ error })
    }
}

module.exports.processPayment = async (req, res) => {
    try {
        res.status(200)
    }
    catch (error) {
        return res.status(500).json({ error })
    }
}