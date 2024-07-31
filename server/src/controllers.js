const supabase = require('./supabase.js')
const User = require('./models/User.js')
const Session = require('./models/Session.js')
const Product = require('./models/Product.js')
const Order = require('./models/Order.js')
const Cart = require('./models/Cart.js')
const isNumber = require('is-number')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports.createUser = async (req, res) => {
    try {
        const { email, password, confirm_password } = req.body

        if (!email) return res.status(400).json({ success: false, message: 'Email is required' })
        else if (password.length < 6) return res.status(400).json({ success: false, message: 'Password should be atleast 6 characters' })
        else if (password !== confirm_password) return res.status(400).json({ success: false, message: 'Password does not match' })

        const { data, error } = await supabase.auth.signUp({
            email, password, options: { emailRedirectTo: `${process.env.CLIENT_URL}/login` }
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

        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        const user = await User.findById(data.user.id)
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' })
        }

        const loginData = { timestamp: data.user.last_sign_in_at }
        if (ip && ip.trim() !== '') {
            loginData.ip = ip
        }

        await Session.findByIdAndUpdate(
            data.user.id,
            { $push: { login: loginData } },
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
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.demoAdmin = async (req, res) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        })
        if (error) throw error

        const user = await User.findById(data.user.id)
        if (!user) return res.status(400).json({ success: false, message: 'User not found' })

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
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.demoUser = async (req, res) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: process.env.USER_EMAIL,
            password: process.env.USER_PASSWORD
        })
        if (error) throw error

        const user = await User.findById(data.user.id)
        if (!user) return res.status(400).json({ success: false, message: 'User not found' })

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
    } catch (error) {
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

    try {
        const newProduct = new Product({ name, description, price, stock })
        await newProduct.save()

        const products = await Product.find().sort({ createdAt: -1 })

        return res.status(200).json({ success: true, data: products })
    } catch (error) {
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

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, price, stock }, { new: true })
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }

        const products = await Product.find().sort({ updatedAt: -1 })

        return res.status(200).json({ success: true, data: products })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.deleteProduct = async (req, res) => {
    const id = req.params.id

    if (req.user.user_role !== 'admin') return res.status(400).json({ success: false, message: 'Unauthorized' })
    else if (!id) return res.status(400).json({ success: false, message: 'Product id is required' })

    try {
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }

        const products = await Product.find().sort({ updatedAt: -1 })

        return res.status(200).json({ success: true, data: products })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.updateCart = async (req, res) => {
    try {
        const { cart } = req.body

        await Cart.findByIdAndUpdate(
            req.user.id,
            { products: cart },
            { new: true, upsert: true }
        )

        res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.fetchCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.user.id).populate('products._id')
        if (!cart) return res.status(404).json({ success: false, message: 'Failed to fetch cart' })

        const products = cart.products.map(item => ({
            ...item._id._doc,
            quantity: item.quantity
        }))

        res.status(200).json({ success: true, data: products })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.checkoutProduct = async (req, res) => {
    try {
        const user_id = req.user.id
        const { cart } = req.body

        const productIds = cart.map(item => item._id)
        const products = await Product.find({ _id: { $in: productIds } })

        const missingProducts = cart.filter(item => !products.some(p => p._id.toString() === item._id))
        if (missingProducts.length > 0) {
            const missingProductNames = missingProducts.map(item => item.name).join(', ')
            return res.status(404).json({
                success: false,
                message: `The following products are not available: ${missingProductNames}`
            })
        }

        const outOfStockProducts = []
        for (let item of cart) {
            const product = products.find(p => p._id.toString() === item._id)
            if (item.quantity > product.stock) {
                outOfStockProducts.push(product.name)
            }
        }

        if (outOfStockProducts.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock for the following products: ${outOfStockProducts.join(', ')}`
            })
        }

        const line_items = cart.map(item => {
            const product = products.find(p => p._id.toString() === item._id)
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: product.name,
                        description: product.description
                    },
                    unit_amount: product.price * 100
                },
                quantity: item.quantity
            }
        })

        const payment_intent_data = {
            metadata: {
                user: user_id,
                products: JSON.stringify(cart.map(item => ({ _id: item._id, quantity: item.quantity })))
            }
        }

        let userCart = await Cart.findById(user_id)
        if (userCart) {
            userCart.products = cart.map(item => ({
                _id: item._id,
                quantity: item.quantity
            }))
            await userCart.save()
        } else {
            userCart = new Cart({
                _id: user_id,
                products: cart.map(item => ({
                    _id: item._id,
                    quantity: item.quantity
                }))
            })
            await userCart.save()
        }

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${process.env.SERVER_URL}/payment?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/error?message=Order failed`,
            payment_intent_data
        })

        res.status(200).json({ success: true, payment_url: session.url })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.fetchOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user.id }).populate('products._id').sort(({ order_date: -1 }))

        return res.status(200).json({ success: true, data: orders })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.fetchSession = async (req, res) => {
    try {
        const loginData = { timestamp: req.user.last_sign_in_at }
        const ip = req.headers['ip']
        if (ip && ip.trim() !== '') loginData.ip = ip

        await Session.findByIdAndUpdate(
            req.user.id,
            { $push: { login: loginData } },
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
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.processPayment = async (req, res) => {
    try {
        const sessionId = req.query.session_id

        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent']
        })
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent.id)

        const user_id = paymentIntent.metadata.user
        const productsMetadata = JSON.parse(paymentIntent.metadata.products)

        const user = await User.findById(user_id)
        if (!user) throw new Error('User not found')

        let total_amount = 0

        for (const productMeta of productsMetadata) {
            const product = await Product.findById(productMeta._id)
            if (!product) throw new Error(`Product with ID ${productMeta._id} not found`)

            if (product.stock < productMeta.quantity) {
                throw new Error(`${product.name} out of stock`)
            }

            product.stock -= productMeta.quantity
            await product.save()

            total_amount += product.price * productMeta.quantity
        }

        await Order.create({
            user_id,
            products: productsMetadata,
            total_amount
        })

        const cart = await Cart.findById(user_id)
        if (cart) {
            cart.products = cart.products.filter(cartItem =>
                !productsMetadata.some(purchasedItem => purchasedItem._id === cartItem._id.toString())
            )
            await cart.save()
        }

        res.redirect(`${process.env.CLIENT_URL}/orders`)
    } catch (error) {
        res.redirect(`${process.env.CLIENT_URL}/error?message=${error.message}`)
    }
}