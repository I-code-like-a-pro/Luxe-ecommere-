 import React from 'react'
 import { Outlet } from 'react-router-dom'
 import Navbar from './Navbar'
 
 const Layout = () => {
   return (
     <div>
        <Navbar   />
        <main className='flex-1'>
        </main>
        <Outlet/>
     </div>
   )
 }
 
 export default Layout