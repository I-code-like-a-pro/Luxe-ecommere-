import React from 'react'

const Hero = () => {
  return (
    <section className='relative bg-pri overflow-hidden'>
      <div className='  h-full'>
        <div className='absolute inset-0'>
          <img src="/hero.jpg" 
          alt="LUXE"
          className='w-full h-full object-cover opacity-40' />
          <div className='absolute inset-0 bg-gradient-to-r from-pri/90 to-transparent'></div>
        </div>
          
          <div className='relative mx-auto max-w-7xl  px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40'>
            <div className='max-w-xl'>
                <p className='uppercase text-accent font-semibold tracking-widest text-sm'>New Collection 2026</p>
                <h1 className='font-semibold tracking-tight text-4xl sm:text-5xl text-pri-fg text-balance mt-4 upercase'>ELEVATE YOUR EVERYDAY LIFESTYLE </h1>
                <p className='text-pri-fg/70 mt-6 text-lg mx-w-lg leading-relaxed'>Discover curated pieces designed for the modern individual. Quality craftsmanship meets timeless aesthetics.</p>
            </div>

            <div className='flex gap-4 mt-10 items-center'>
                <button className='bg-accent rounded-lg px-4 py-2 text-pri-fg hover:bg-accent/90'>
                    Shop Now
                </button>
                <button className='px-4 py-2 border border-pri-fg/20 bg-transparent items-center text-pri-fg hover:bg-pri-fg/10 rounded-lg'>View Lookbook</button>
            </div>
          </div>
      </div>
    </section>
  )
}

export default Hero

