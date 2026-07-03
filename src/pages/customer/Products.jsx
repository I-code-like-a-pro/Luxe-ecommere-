import { Link } from 'react-router-dom'
import { Star, StarHalf } from 'lucide-react'
import products from '../../data/product.js'

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
    <div className='min-h-screen bg-sec'>
      <div className='px-4 py-8 sm:px-6 lg:px-8'>
        <section>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h1 className='text-xl font-bold tracking-tight text-fg sm:text-2xl lg:text-3xl'>
                Products
              </h1>
              <p className='mt-1 text-sm text-muted-fg sm:mt-3 sm:text-lg'>
                Explore the full LUXE collection
              </p>
            </div>
          </div>

          <div className='mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6'>
            {products.map((product) => (
              <Link
                to={`/products/${product.id}`}
                key={product.id}
                className='group flex flex-col overflow-hidden rounded-lg border border-transparent'
              >
                <div className='relative aspect-square overflow-hidden rounded-lg bg-sec'>
                  <img
                    src={product.image}
                    alt={product.name}
                    className='block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                </div>

                <div className='mt-3 flex flex-col sm:mt-4'>
                  <h3 className='truncate text-sm font-medium text-foreground transition-colors group-hover:text-accent sm:text-base'>
                    {product.name}
                  </h3>

                  <div className='mt-1 flex items-center gap-1'>
                    <StarRating rating={product.rating} />
                    <span className='text-xs text-gray-500'>({product.reviews})</span>
                  </div>

                  <p className='mt-1 text-sm font-medium text-muted-fg'>${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Products
