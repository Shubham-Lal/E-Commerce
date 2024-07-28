import { useProductStore } from '../store/useProductStore'
import ProductCard from '../components/product-card'

export default function Home() {
    const { products } = useProductStore()

    return (
        <div className='columns-1 sm:columns-2 xl:columns-3'>
            {products.length > 0 && (
                products.map((item, id) => <ProductCard key={id} data={item} />)
            )}
        </div>
    )
}