import React from 'react'
import { Star, StarHalf, ChevronLeft } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import products from '../../data/product'
import QuantitySelector from '../../components/QuantitySelector'

// ─── Star Rating ─────────────────────────────────────────────────────────────

const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => {
      const filled = star <= Math.floor(rating)
      const half = !filled && star === Math.ceil(rating) && rating % 1 !== 0
      return (
        <span key={star}>
          {filled ? (
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
          ) : half ? (
            <span className="relative inline-block">
              <Star size={16} className="fill-gray-200 text-gray-200" />
              <StarHalf size={16} className="fill-yellow-400 text-yellow-400 absolute inset-0" />
            </span>
          ) : (
            <Star size={16} className="fill-gray-200 text-gray-200" />
          )}
        </span>
      )
    })}
  </div>
)

// ─── Stock Badge ─────────────────────────────────────────────────────────────

const StockBadge = ({ stock }) =>
  stock > 0 ? (
    <span className="text-sm bg-green-100 text-green-800 rounded-full px-3 py-1 w-fit">
      In Stock
    </span>
  ) : (
    <span className="text-sm bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 w-fit">
      Out of Stock
    </span>
  )

// ─── Main Component ───────────────────────────────────────────────────────────

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find((p) => p.id === parseInt(id))

  if (!product) return <div className="p-10 text-center">Product not found</div>

  const originalPrice = product.originalPrice || (product.price * 1.4).toFixed(2)

  return (
    <div className="bg-bgc min-h-screen">

      {/* Back link */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-fg hover:text-fg transition-colors duration-200"
        >
          <ChevronLeft size={16} />
          Back to Products
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* ── Images ── */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* ── Details ── */}
        <section className="flex flex-col gap-5">

          {/* Category badge */}
          <span className="bg-gray-100 text-sm font-medium tracking-tight rounded-full w-fit px-3 py-1">
            {product.category}
          </span>

          {/* Name */}
          <h1 className="font-bold text-3xl md:text-4xl text-fg leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} />
            <span className="text-muted-fg text-sm">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-3xl">${product.price}</span>
            <span className="text-muted-fg line-through text-lg">${originalPrice}</span>
          </div>

          {/* Stock */}
          <StockBadge stock={product.stock} />

          {/* Description */}
          <p className="text-muted-fg leading-relaxed">
            {product.description}
          </p>

          {/* Quantity */}
          <div className="flex flex-col gap-2">
            <span className="font-medium text-sm">Quantity</span>
            <QuantitySelector />
          </div>

          {/* CTA */}
          <button className="bg-nav text-pri-fg w-full rounded-xl px-6 py-4 font-medium text-base hover:opacity-90 transition-opacity duration-200">
            Proceed to checkout
          </button>

          {/* Shipping info */}
          <div className="flex flex-col border-t border-gray-200 mt-2">
            {[
              { label: 'Shipping',  value: 'Free worldwide shipping' },
              { label: 'Returns',   value: '30-day return policy' },
              { label: 'Warranty',  value: '2-year craftsmanship guarantee' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-3">
                <span className="text-muted-fg">{label}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>

        </section>
      </div>
    </div>
  )
}

export default ProductDetails