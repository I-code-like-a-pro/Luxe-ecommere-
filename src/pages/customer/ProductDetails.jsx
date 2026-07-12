import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Star, StarHalf, Search } from 'lucide-react'
import products from '../../data/product.js'
import { useCart } from '../../context/useCart.js'
import '../../App.css'
import TypewriterEffect from '../../components/typeWriter.jsx'

const getReviewStorageKey = (productId) => `luxe-product-reviews-${productId}`

const normalizeStoredReview = (review, productId) => {
  if (!review || typeof review !== 'object') {
    return null
  }

  if (typeof review.rating === 'number' && typeof review.comment === 'string') {
    return review
  }

  if (review[productId] && typeof review[productId] === 'object') {
    return review[productId]
  }

  const nestedKey = Object.keys(review).find(
    (key) => review[key] && typeof review[key] === 'object' && typeof review[key].rating === 'number'
  )

  return nestedKey ? review[nestedKey] : null
}

const readProductReviews = (productId) => {
  try {
    const storedReviews = localStorage.getItem(getReviewStorageKey(productId))
    if (!storedReviews) {
      return []
    }

    const parsedReviews = JSON.parse(storedReviews)
    if (!Array.isArray(parsedReviews)) {
      return []
    }

    return parsedReviews
      .map((review) => normalizeStoredReview(review, productId))
      .filter(Boolean)
  } catch {
    return []
  }
}

const StarRating = ({ rating }) => {
  return (
    <div className='product-detail-stars' aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating)
        const half = !filled && star === Math.ceil(rating) && rating % 1 !== 0

        return (
          <span key={star}>
            {filled ? (
              <Star size={18} className='fill-yellow-400 text-yellow-400' />
            ) : half ? (
              <StarHalf size={18} className='fill-yellow-400 text-yellow-400' />
            ) : (
              <Star size={18} className='fill-gray-200 text-gray-200' />
            )}
          </span>
        )
      })}
    </div>
  )
}

const ProductDetailsContent = ({ productId }) => {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [productReviews, setProductReviews] = useState(() => readProductReviews(productId))
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSummaryText, setAiSummaryText] = useState('')

  const product = products.find((item) => item.id === Number(productId))
  const initialProductReviews = product?.reviewsData || []
  const allReviews = [...initialProductReviews, ...productReviews]
  const displayedReviewCount = allReviews.length
  const displayedRating = displayedReviewCount
    ? Number((allReviews.reduce((total, review) => total + review.rating, 0) / displayedReviewCount).toFixed(1))
    : 0

  if (!product) {
    return (
      <div className='product-detail-page'>
        <section className='product-detail-shell'>
          <p className='cart-eyebrow'>Product not found</p>
          <h1>We could not find that product.</h1>
          <Link className='product-primary-link' to='/products'>
            Back to products
          </Link>
        </section>
      </div>
    )
  }

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))
  }

  const increaseQuantity = () => {
    setQuantity((currentQuantity) => Math.min(product.stock, currentQuantity + 1))
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleReviewSubmit = (event) => {
    event.preventDefault()

    const newReview = {
      id: `${productId}-${Date.now()}`,
      name: reviewName.trim() || 'Anonymous',
      rating: Number(reviewRating),
      comment: reviewComment.trim(),
      createdAt: new Date().toLocaleDateString(),
    }

    setProductReviews((currentReviews) => {
      const nextReviews = [newReview, ...currentReviews]
      localStorage.setItem(getReviewStorageKey(productId), JSON.stringify(nextReviews))
      return nextReviews
    })

    setReviewName('')
    setReviewRating(5)
    setReviewComment('')
  }

  const extractComments = () => {
    return allReviews.map((review) => review.comment).filter(Boolean)
  }

  const analyzeReviews = async (comments) => {
    const response = await fetch('/api/analyze-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviews: comments }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Analysis API error ${response.status}: ${errorBody}`)
    }

    return response.json()
  }

  const fetchReviewsSummary = async () => {
    const comments = extractComments()
    if (!comments.length) {
      setAiSummaryText('No reviews available to summarize.')
      return
    }
    setAiLoading(true)
    try {
      const result = await analyzeReviews(comments)
      const pros = (result.pros || []).join('; ')
      const cons = (result.cons || []).join('; ')
      const combined = `Pros: ${pros || 'None'} — Cons: ${cons || 'None'}`
      setAiSummaryText(combined)
    } catch (err) {
      console.error(err)
      setAiSummaryText('Unable to analyze reviews at this time.')
    } finally {
      setAiLoading(false)
      setAiPanelOpen(true)
    }
  }

  return (
    <div className='product-detail-page'>
      <section className='product-detail-shell'>
        <div className='product-detail-image'>
          <img src={product.image} alt={product.name} />
        </div>

        <div className='product-detail-content'>
          <p className='cart-eyebrow'>{product.category}</p>
          <h1>{product.name}</h1>
          <p className='product-detail-description'>{product.description}</p>

          <div className='product-detail-meta'>
            <span>${product.price}</span>
            <span>{product.stock} in stock</span>
            <span className='product-rating-pill'>
              <StarRating rating={displayedRating} />
              {displayedRating} ({displayedReviewCount})
            </span>
          </div>

          <div className='quantity-control' aria-label='Select quantity'>
            <button type='button' onClick={decreaseQuantity} aria-label='Decrease quantity'>
              <Minus size={18} />
            </button>
            <strong>{quantity}</strong>
            <button type='button' onClick={increaseQuantity} aria-label='Increase quantity'>
              <Plus size={18} />
            </button>
          </div>

          <button className='add-to-cart-button' type='button' onClick={handleAddToCart}>
            <ShoppingBag size={20} />
            Add to cart
          </button>
        </div>
      </section>

      <section className='product-reviews-shell'>
        <div className='review-form-card'>
          <p className='cart-eyebrow'>Reviews</p>
          <h2>Write a review</h2>

          <form className='review-form' onSubmit={handleReviewSubmit}>
            <label>
              Name
              <input
                type='text'
                value={reviewName}
                onChange={(event) => setReviewName(event.target.value)}
                placeholder='Your name'
              />
            </label>

            <label>
              Rating
              <select
                value={reviewRating}
                onChange={(event) => setReviewRating(event.target.value)}
              >
                <option value='5'>5 stars</option>
                <option value='4'>4 stars</option>
                <option value='3'>3 stars</option>
                <option value='2'>2 stars</option>
                <option value='1'>1 star</option>
              </select>
            </label>

            <label className='review-comment-field'>
              Review
              <textarea
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                placeholder='Share your thoughts about this product'
                required
              />
            </label>

            <button className='add-to-cart-button' type='submit'>
              Submit review
            </button>
          </form>
        </div>

        <div className='review-list-card'>
          <div className='review-list-header'>
            <div>
              <p className='cart-eyebrow'>Customer feedback</p>
              <h2>{allReviews.length} reviews</h2>
            </div>
            <StarRating rating={displayedRating} />
          </div>

          {allReviews.length > 0 ? (
            <div className='review-list'>
              {allReviews.map((review) => (
                <article className='review-item' key={review.id}>
                  <div className='reviews-item-header'>
                    <strong>{review.name}</strong>
                    <span>{review.createdAt}</span>
                  </div>
                  <StarRating rating={review.rating} />
                  <p>{review.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className='review-empty'>No customer reviews yet. Be the first to review this product.</p>
          )}
        </div>
      </section>

      {/* AI floating widget */}
      <div className={`ai-widget ${aiPanelOpen ? 'open' : ''}`}>
        <button
          className='ai-button'
          aria-label='Open AI assistant'
          onClick={() => setAiPanelOpen((v) => !v)}
        >
          <Search size={18} />
        </button>

        <div className='ai-panel' role='dialog' aria-hidden={!aiPanelOpen}>
          <div className='ai-header'>
            <strong>AI Review Summarizer</strong>
            <button className='ai-close' onClick={() => setAiPanelOpen(false)}>
              ✕
            </button>
          </div>

          <div className='ai-content'>
            {aiLoading ? (
              <p className='muted'>Analyzing reviews…</p>
            ) : aiSummaryText ? (
              <TypewriterEffect text={aiSummaryText} speed={30} />
            ) : (
              <p className='muted'>Get a quick summary of customer feedback.</p>
            )}
          </div>

          <div className='ai-actions'>
            <button className='add-to-cart-button' onClick={fetchReviewsSummary}>
              See reviews summary
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProductDetails = () => {
  const { productId } = useParams()
  

  return <ProductDetailsContent key={productId} productId={productId} />
}

export default ProductDetails
