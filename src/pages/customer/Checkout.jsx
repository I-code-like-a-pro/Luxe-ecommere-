import { CreditCard, Landmark, Smartphone, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/useCart.js'
import '../../App.css'

const Checkout = () => {
  const { cart, totalProducts, subtotal } = useCart()

  const paymentMethods = [
    {
      name: 'Card payment',
      description: 'Pay securely with a debit or credit card.',
      icon: CreditCard,
    },
    {
      name: 'Bank transfer',
      description: 'Transfer directly from your bank account.',
      icon: Landmark,
    },
    {
      name: 'Mobile money',
      description: 'Use a supported mobile wallet to complete payment.',
      icon: Smartphone,
    },
  ]

  return (
    <div className='checkout-page'>
      <section className='checkout-shell'>
        <div className='checkout-header'>
          <div>
            <p className='cart-eyebrow'>Checkout</p>
            <h1>Choose how to pay</h1>
          </div>
          <WalletCards size={34} />
        </div>

        {cart.length > 0 ? (
          <div className='checkout-layout'>
            <div className='payment-methods'>
              {paymentMethods.map((method) => {
                const Icon = method.icon

                return (
                  <button className='payment-method' type='button' key={method.name}>
                    <Icon size={24} />
                    <span>
                      <strong>{method.name}</strong>
                      <small>{method.description}</small>
                    </span>
                  </button>
                )
              })}
            </div>

            <aside className='checkout-summary'>
              <h2>Order summary</h2>
              <div>
                <span>Items</span>
                <strong>{totalProducts}</strong>
              </div>
              <div>
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>Free</strong>
              </div>
              <div className='checkout-total'>
                <span>Total</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
            </aside>
          </div>
        ) : (
          <div className='cart-empty'>
            <WalletCards size={32} />
            <p>Your cart is empty.</p>
            <Link className='product-primary-link' to='/products'>
              View products
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

export default Checkout
