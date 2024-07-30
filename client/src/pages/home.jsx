import { useProductStore } from '../store/useProductStore'
import { LoadingSVG } from '../components/loading'
import ProductCard from '../components/product-card'

export default function Home() {
    const { products } = useProductStore()

    if (products.status === 'fetching')
        return <div className='w-full flex justify-center'><LoadingSVG size={24} color='#000' /></div>
    else if (products.status === 'fetched')
        return (
            <div className='columns-1 sm:columns-2 xl:columns-3 gap-3'>
                {!products.items.length ? <p>No products yet</p>
                    : products.items.map((item, id) => <ProductCard key={id} data={item} />)
                }
            </div>
        )
    else return <p>Failed to fetch products</p>
}