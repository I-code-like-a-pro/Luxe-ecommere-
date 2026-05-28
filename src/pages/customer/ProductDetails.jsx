import React from 'react'
import { Star, StarHalf } from 'lucide-react'
import { useParams } from 'react-router-dom'
import products from '../../data/product'
import QuantitySelector from '../../components/QuantitySelector'

const StarRating = ({ rating }) => {
    return (
        <div className='flex items-center'>
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= Math.floor(rating)
                const half = !filled && star === Math.ceil(rating) && rating % 1 !== 0
                return (
                    <span key={star}>
                        {filled ? (
                            <Star size={14} className='fill-yellow-400 text-yellow-400' />
                        ) : half ? (
                            <span className="relative inline-block">
                                <Star size={14} className='fill-gray-200 text-gray-200' />
                                <StarHalf size={14} className='fill-yellow-400 text-yellow-400 absolute inset-0' />
                            </span>
                        ) : (
                            <Star size={14} className='fill-gray-200 text-gray-200' />
                        )}
                    </span>
                )
            })}
        </div>
    )
}

const getStock = (stock) => stock > 0 ? <span className='text-sm  py-1 tracking-tight bg-green-100 text-green-800 border rounded-full border-none px-2'>In stock</span> : <span className='bg-yellow-100 text-yellow-800 border border-none rounded-lg px-2'>Out of stock</span>
const ProductDetails = () => {
    const { id } = useParams()
    const product = products.find(p => p.id === parseInt(id))

    if (!product) return <div>Product not found</div>

    return (
        <div className='bg-bgc min-h-screen'>
            <section id="product-details" className='flex flex-col gap-2 mx-2'>
              <span className='bg-border/50 text-sm tracking-tight 
              border border-none rounded-full w-fit font-semibold tracking-tight px-3 items-center flex justify-center  '>
                {product.category}</span>
                <h1 className='font-bold text-3xl md:text-4xl text-fg'>
                    {product.name}
                </h1>
                <div className='flex gap-2 items-center'>
                    <StarRating rating={product.rating} />
                    <span className='flex text-muted-fg gap-1 items-center'>
                        <span>{product.rating}</span>
                        <span>({product.reviews} reviews)</span>
                    </span>
                </div>
                <p className='font-bold text-3xl'>${product.price}</p>
                <div>{getStock(product.stock)}</div>

                <div className='text-muted-fg'>
                    {product.description}
                </div>

                <div>
                    <div>
                        <span className='font-medium text-sm'>Quantity</span>
                        <QuantitySelector/>
                    </div>
                </div>
                <button className='bg-nav text-pri-fg border w-64 rounded-lg px-6 py-3 font-medium'>Proceed to checkout</button>
                <span className='bg-pri-fg'></span>

                <div  className='text-sec-for'>
                    <div>Shipping:
Free worldwide shipping</div>
<div>Returns:
30-day return policy</div>
<div>
    Warranty:
2-year craftsmanship guarantee
</div>
                </div>
            </section>
        </div>
    )
}

export default ProductDetails