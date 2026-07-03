import { Link } from 'react-router-dom'
import products from '../data/product.js'
import { Star, StarHalf } from 'lucide-react'

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
                            <StarHalf size={14} className='fill-yellow-400 text-yellow-400' />
                        ) : (
                            <Star size={14} className='fill-gray-200 text-gray-200' />
                        )}
                    </span>
                )
            })}
        </div>
    )
}

const Products = () => {
  return (
    <div className='bg-sec'>
        <div className='px-4 sm:px-6 lg:px-8 py-6'>
            <section>
                {/* Header — stacks on mobile */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                    <div>
                        <h1 className='text-fg text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight'>
                            Featured Products
                        </h1>
                        <p className='text-muted-fg mt-1 sm:mt-3 text-sm sm:text-lg'>
                            Handpicked essentials for every occasion
                        </p>
                    </div>
                    <div>
                        <button className='text-accent flex gap-2 text-sm sm:text-base'>
                            View all →
                        </button>
                    </div>
                </div>

                {/* Grid — 1 col mobile, 2 col tablet, 3 col desktop */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-3 sm:gap-4 lg:gap-6 w-full'>
                {
                    products.map((product) => (
                        <Link to={`/products/${product.id}`} key={product.id} className='group border border-transparent rounded-lg overflow-hidden flex flex-col'>
                            {/* Image */}
                            <div className='bg-sec relative aspect-square overflow-hidden rounded-lg'>
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className='transition-transform duration-500 group-hover:scale-105 block h-full object-cover w-full overflow-hidden' 
                                /> 
                            </div>

                            {/* Product info */}
                            <div className='flex flex-col mt-3 sm:mt-4'>
                                <h3 className='text-xs sm:text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate'>
                                    {product.name} 
                                </h3>

                                {/* Star rating */}
                                <div className='flex items-center gap-1 mt-1'>
                                    <StarRating rating={product.rating} />
                                    <span className='text-xs text-gray-500'>
                                        ({product.reviews})
                                    </span>
                                </div>

                                <p className='mt-1 text-xs sm:text-sm text-muted-fg font-medium'>
                                    ${product.price}
                                </p>
                            </div>
                        </Link>
                    ))
                }
                </div>
              
            </section>
        </div>
    </div>
  )
}

export default Products
