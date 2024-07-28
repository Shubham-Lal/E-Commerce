const supabase = require('./supabase')
const { AuthApiError } = require('@supabase/supabase-js')
const mongoose = require('mongoose')
const User = require('./models/User.js')
const Session = require('./models/Session.js')
const Product = require('./models/Product.js')
const isNumber = require('is-number')

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

        await Session.findByIdAndUpdate(
            data.user.id,
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
        await Session.findByIdAndUpdate(
            req.user.id,
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
    const { name, description, price, stock } = req.body

    if (req.user.user_role !== 'admin') return res.status(400).json({ success: false, message: 'Unauthorized' })
    else if (!name) return res.status(400).json({ success: false, message: 'Product name is required' })
    else if (!description) return res.status(400).json({ success: false, message: 'Product description is required' })
    else if (!price) return res.status(400).json({ success: false, message: 'Product price is required' })
    else if (!isNumber(price)) return res.status(400).json({ success: false, message: 'Product price must be a number' })
    else if (price <= 0) return res.status(400).json({ success: false, message: 'Product price must be greater than 0' })
    else if (!stock) return res.status(400).json({ success: false, message: 'Product stock is required' })
    else if (!isNumber(stock)) return res.status(400).json({ success: false, message: 'Product stock must be a number' })
    else if (stock <= 0) return res.status(400).json({ success: false, message: 'Product stock must be greater than 0' })

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const newProduct = new Product({ name, description, price, stock })
        await newProduct.save({ session })

        const products = await Product.find().sort({ createdAt: -1 }).session(session)

        await session.commitTransaction()
        session.endSession()

        return res.status(200).json({ success: true, data: products })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.fetchProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 })

        res.status(200).json({ success: true, data: products })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.updateProduct = async (req, res) => {
    const id = req.params.id
    const { name, description, price, stock } = req.body

    if (req.user.user_role !== 'admin') return res.status(400).json({ success: false, message: 'Unauthorized' })
    else if (!id) return res.status(400).json({ success: false, message: 'Product id is required' })
    else if (!name) return res.status(400).json({ success: false, message: 'Product name is required' })
    else if (!description) return res.status(400).json({ success: false, message: 'Product description is required' })
    else if (!price) return res.status(400).json({ success: false, message: 'Product price is required' })
    else if (isNaN(price)) return res.status(400).json({ success: false, message: 'Product price must be a number' })
    else if (price <= 0) return res.status(400).json({ success: false, message: 'Product price must be greater than 0' })
    else if (!stock) return res.status(400).json({ success: false, message: 'Product stock is required' })
    else if (isNaN(stock)) return res.status(400).json({ success: false, message: 'Product stock must be a number' })
    else if (stock < 0) return res.status(400).json({ success: false, message: 'Product stock must be greater than or equal to 0' })

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, price, stock }, { new: true, session })
        if (!updatedProduct) {
            await session.abortTransaction()
            session.endSession()
            return res.status(404).json({ success: false, message: 'Product not found' })
        }

        const products = await Product.find().sort({ updatedAt: -1 }).session(session)

        await session.commitTransaction()
        session.endSession()

        return res.status(200).json({ success: true, data: products })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.deleteProduct = async (req, res) => {
    const id = req.params.id

    if (req.user.user_role !== 'admin') return res.status(400).json({ success: false, message: 'Unauthorized' })
    else if (!id) return res.status(400).json({ success: false, message: 'Product id is required' })

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const deletedProduct = await Product.findByIdAndDelete(id, { session })
        if (!deletedProduct) {
            await session.abortTransaction()
            session.endSession()
            return res.status(404).json({ success: false, message: 'Product not found' })
        }

        const products = await Product.find().sort({ updatedAt: -1 }).session(session)

        await session.commitTransaction()
        session.endSession()

        return res.status(200).json({ success: true, data: products })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
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