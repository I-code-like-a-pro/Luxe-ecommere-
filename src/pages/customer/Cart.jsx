import { ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/useCart.js'
import '../../App.css'

const Cart = () => {
  const { cart, totalProducts, subtotal, updateQuantity, removeFromCart } = useCart()

  return (
    <div className='cart-page'>
      <section className='cart-shell'>
        <div className='cart-header'>
          <div>
            <p className='cart-eyebrow'>Shopping cart</p>
            <h1>Your Cart</h1>
          </div>

          <div className='cart-total-badge' aria-label={`${totalProducts} products in cart`}>
            <ShoppingBag size={22} />
            <span>{totalProducts}</span>
          </div>
        </div>

        <div className='cart-summary'>
          <p>Total products in cart array</p>
          <strong>{totalProducts}</strong>
        </div>

        {cart.length > 0 ? (
          <div className='cart-items'>
            {cart.map((product) => (
              <article className='cart-item' key={product.id}>
                <img src={product.image} alt={product.name} />

                <div className='cart-item-details'>
                  <h2>{product.name}</h2>
                  <p>{product.category}</p>
                  <div className='cart-quantity-actions'>
                    <button
                      type='button'
                      onClick={() => updateQuantity(product.id, product.quantity - 1)}
                      aria-label={`Decrease ${product.name} quantity`}
                    >
                      -
                    </button>
                    <span>Qty: {product.quantity}</span>
                    <button
                      type='button'
                      onClick={() => updateQuantity(product.id, product.quantity + 1)}
                      aria-label={`Increase ${product.name} quantity`}
                    >
                      +
                    </button>
                    <button type='button' onClick={() => removeFromCart(product.id)}>
                      Remove
                    </button>
                  </div>
                </div>

                <strong>${(product.price * product.quantity).toFixed(2)}</strong>
              </article>
            ))}
          </div>
        ) : (
          <div className='cart-empty'>
            <ShoppingBag size={32} />
            <p>Your cart is empty.</p>
          </div>
        )}

        <div className='cart-footer'>
          <span>Subtotal</span>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>

        {cart.length > 0 && (
          <Link className='checkout-button' to='/checkout'>
            Checkout
          </Link>
        )}
      </section>
    </div>
  )
}

export default Cart
