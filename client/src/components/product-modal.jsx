import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { IoMdClose } from 'react-icons/io'
import { LoadingSVG } from './loading'

const ProductModal = ({ type, data, setCreate, setProducts }) => {
    const { setUser } = useAuthStore()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [newProduct, setNewProduct] = useState(type === 'Add' ? {
        name: '', description: '', price: '', stock: ''
    } : data)

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            setCreate({ open: false, type: '' })
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setNewProduct((prevCredentials) => ({
            ...prevCredentials,
            [name]: value
        }))
    }

    const handleProductSubmit = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem('token')
        if (!token) return setUser({ id: '', email: '', role: '', auth: 'failed' })

        setError('')
        setLoading(true)

        const url = type === 'Add' ? `${import.meta.env.VITE_SERVER_URL}/products` : `${import.meta.env.VITE_SERVER_URL}/products/${data._id}`
        const method = type === 'Add' ? 'POST' : 'PUT'

        await fetch(url, {
            method,
            headers: {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    setProducts(response.data)
                    setCreate({ open: false, type: '' })
                }
                else setError(response.message)
            })
            .catch(err => setError(err.message))
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <div
            className='fixed top-0 left-0 z-20 w-full h-[100dvh] backdrop-blur flex items-center justify-center'
            onClick={handleBackgroundClick}
        >
            <form className='mx-3 p-3 max-w-[500px] w-full max-h-[100dvh] bg-white border overflow-y-auto' onSubmit={handleProductSubmit}>
                <div className='mb-2 sm:mb-2.5 flex items-center justify-between'>
                    <h1 className='text-2xl sm:text-3xl text-center'>{type} Product</h1>

                    <button
                        className='group'
                        onClick={() => setCreate({ open: false, type: '' })}
                    >
                        <IoMdClose size={30} className='text-gray-500 group-hover:text-black' />
                    </button>
                </div>

                <input
                    name='name'
                    className='w-full my-1.5 py-2 px-3 outline-none border-2 focus:border-black'
                    placeholder='Enter name'
                    value={newProduct.name}
                    onChange={handleChange}
                />

                <textarea
                    name='description'
                    className='w-full min-h-[150px] my-1.5 py-2 px-3 outline-none border-2 focus:border-black resize-y'
                    placeholder='Enter description'
                    value={newProduct.description}
                    onChange={handleChange}
                />

                <div className='mt-1.5 flex gap-3'>
                    <input
                        name='price'
                        className='w-1/2 py-2 px-3 outline-none border-2 focus:border-black'
                        placeholder='Enter price'
                        value={newProduct.price}
                        onChange={handleChange}
                    />
                    <input
                        name='stock'
                        className='w-1/2 py-2 px-3 outline-none border-2 focus:border-black'
                        placeholder='Enter stock'
                        value={newProduct.stock}
                        onChange={handleChange}
                    />
                </div>

                <button
                    className={`mt-3 w-full py-2 px-3 flex justify-center ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-black'} text-white`}
                    disabled={loading}
                >
                    {loading ? <LoadingSVG size={24} color='#000' /> : type === 'Add' ? 'Create' : 'Update'}
                </button>

                {error && <p className='mt-3 text-center text-red-600'>{error}</p>}
            </form>
        </div>
    )
}

export default ProductModal