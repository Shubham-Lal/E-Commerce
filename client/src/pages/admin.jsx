import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { MdEdit, MdDelete } from 'react-icons/md'
import Product from '../components/product'

export default function Admin() {
    const { setUser } = useAuthStore()

    const [create, setCreate] = useState({ open: false, type: '' })
    const [products, setProducts] = useState([])
    const [editProduct, setEditProduct] = useState(null)

    const handleEditProduct = (product) => {
        setEditProduct(product)
        setCreate({ open: true, type: 'Edit' })
    }

    const handleDeleteProduct = async (id) => {
        const token = localStorage.getItem('token')
        if (!token) return setUser({ id: '', email: '', role: '', auth: 'failed' })

        await fetch(`${import.meta.env.VITE_SERVER_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    setProducts(response.data)
                }
            })
    }

    useEffect(() => {
        const fetchProducts = async () => {
            await fetch(`${import.meta.env.VITE_SERVER_URL}/products`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(res => res.json())
                .then(response => {
                    if (response.success) setProducts(response.data)
                    else setProducts(null)
                })
                .catch(() => setProducts(null))
        }

        fetchProducts()
    }, [])

    return (
        <div className='relative overflow-x-hidden'>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl sm:text-3xl'>Products</h1>
                <button className='py-2 px-3 bg-black text-white' onClick={() => setCreate({ open: true, type: 'Add' })}>
                    Create Product
                </button>
            </div>
            <div className='overflow-x-auto'>
                <table className='w-[1240px] mt-3 border-collapse border border-gray-300'>
                    <thead className='bg-gray-100'>
                        <tr>
                            <th className='w-[20%] border border-gray-300'>Name</th>
                            <th className='border border-gray-300'>Description</th>
                            <th className='w-[10%] border border-gray-300'>Price</th>
                            <th className='w-[10%] border border-gray-300'>Stock</th>
                            <th className='w-[50px] border border-gray-300'></th>
                            <th className='w-[50px] border border-gray-300'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products === null || products === undefined ? <tr><td className='py-2 px-3'>Failed to fetch products</td></tr>
                            : products.length === 0 ? <tr><td className='py-2 px-3'>No products yet</td></tr>
                                : products.map((item, id) => (
                                    <tr key={id}>
                                        <td className='py-2 px-3 border border-gray-300 text-center'>{item.name}</td>
                                        <td className='py-2 px-3 border border-gray-300'>{item.description}</td>
                                        <td className='py-2 px-3 border border-gray-300 text-center'>₹{item.price}</td>
                                        <td className='py-2 px-3 border border-gray-300 text-center'>{item.stock}</td>
                                        <td className='py-2 px-3 border border-gray-300 cursor-pointer group' onClick={() => handleEditProduct(item)}>
                                            <MdEdit size={25} className='text-gray-600 group-hover:text-black' />
                                        </td>
                                        <td className='py-2 px-3 border border-gray-300 cursor-pointer group' onClick={() => handleDeleteProduct(item._id)}>
                                            <MdDelete size={25} className='text-gray-600 group-hover:text-black' />
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody>
                </table>
            </div>

            {create.open && <Product type={create.type} data={editProduct} setCreate={setCreate} setProducts={setProducts} />}
        </div>
    )
}