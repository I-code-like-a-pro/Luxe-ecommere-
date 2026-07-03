import { Link } from 'react-router-dom'
import { Search, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/useCart.js'

const Navbar = () => {
    const { totalProducts } = useCart()
    const navlinks = [
        {
            "name":"New Arrivals","label":"Arrivals"
        },
        {
            "name":"Men",
            "label":"Men"
        },
        {
            "name":"Women",
            "label":"Women"
        },
        {
            "name":"Accessories",
            "label":"Accessories"
        },
        {
            "name":"sale",
            "label":"sale"
        }
    ]
  return (
    <div>
        <div className='sticky top-0 z-50'>
            <nav className='bg-nav w-full p-4 h-100vh flex text-nav-fg gap-4 sticky' >
               <div className='w-full'>
                <div className='flex justify-between w-full'>
                     <Link to='/' className='text-xl font-bold tracking-tight hover:cursor-pointer'>
                    LUXE
                </Link>

               
               <ul className='flex items-center gap-4'>
                {
                    navlinks.map((navlink)=> (
                        <li className='hover:cursor-pointer text-nav-fg/70 hover:text-nav-fg' key={navlink.label}>
                            {navlink.name}

                        </li>
                    ))
                }
               </ul>
                <div>
                    <div className='flex justify-center gap-4'>
                       <button className='text-nav-fg/70 hover:text-nav/'>
                        <Search className='h-5 w-5'/>
                       </button>

                       <Link to='/cart' className='relative block' aria-label={`${totalProducts} products in cart`}>
                        <ShoppingBag/>
                        <span className='absolute top-1.5 right-2.5 bg-accent border rounded-full h-4 w-4 flex justify-center items-center border-transparent'>
                            {totalProducts}
                        </span>
                       </Link>
                    </div>
                    
                </div>



                </div>
               </div>
            </nav>

        </div>
    </div>
  )
}

export default Navbar
