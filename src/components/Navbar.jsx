import { Link } from 'react-router-dom'
import { Search, ShoppingBag, Menu } from 'lucide-react'
import { useCart } from '../context/useCart.js'

const Navbar = () => {
  const { totalProducts } = useCart()
  const navlinks = [
    { name: 'New Arrivals', label: 'Arrivals' },
    { name: 'Men', label: 'Men' },
    { name: 'Women', label: 'Women' },
    { name: 'Accessories', label: 'Accessories' },
    { name: 'sale', label: 'sale' },
  ]

  return (
    <header className='sticky top-0 z-50 w-full bg-nav text-nav-fg'>
      <nav className='mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between gap-3'>
          <Link to='/' className='text-xl font-bold tracking-tight hover:cursor-pointer'>
            LUXE
          </Link>

          <div className='flex items-center gap-2 sm:gap-3'>
            <button className='rounded-full p-2 text-nav-fg/80 transition hover:bg-white/10 hover:text-nav-fg' aria-label='Search'>
              <Search className='h-5 w-5' />
            </button>

            <Link to='/cart' className='relative block rounded-full p-2 transition hover:bg-white/10' aria-label={`${totalProducts} products in cart`}>
              <ShoppingBag className='h-5 w-5' />
              <span className='absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full border border-transparent bg-accent text-[10px] font-semibold text-accent-fg'>
                {totalProducts}
              </span>
            </Link>

            <button className='rounded-full p-2 text-nav-fg/80 transition hover:bg-white/10 hover:text-nav-fg sm:hidden' aria-label='Toggle menu'>
              <Menu className='h-5 w-5' />
            </button>
          </div>
        </div>

        <ul className='hidden items-center gap-4 text-sm sm:flex'>
          {navlinks.map((navlink) => (
            <li className='text-nav-fg/70 transition hover:cursor-pointer hover:text-nav-fg' key={navlink.label}>
              {navlink.name}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
