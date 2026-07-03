import React from 'react'

const Hero = () => {
  return (
    <section className='relative overflow-hidden bg-pri'>
      <div className='h-full'>
        <div className='absolute inset-0'>
          <img
            src='/hero.jpg'
            alt='LUXE'
            className='h-full w-full object-cover opacity-40'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-pri/90 to-transparent'></div>
        </div>

        <div className='relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-40'>
          <div className='max-w-xl'>
            <p className='text-sm font-semibold uppercase tracking-[0.25em] text-accent'>
              New Collection 2026
            </p>
            <h1 className='mt-4 text-4xl font-semibold uppercase tracking-tight text-pri-fg sm:text-5xl lg:text-6xl'>
              ELEVATE YOUR EVERYDAY LIFESTYLE
            </h1>
            <p className='mx-w-lg mt-6 text-base leading-relaxed text-pri-fg/70 sm:text-lg'>
              Discover curated pieces designed for the modern individual. Quality craftsmanship meets timeless aesthetics.
            </p>
          </div>

          <div className='mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center'>
            <button className='rounded-lg bg-accent px-4 py-2 text-pri-fg transition hover:bg-accent/90'>
              Shop Now
            </button>
            <button className='rounded-lg border border-pri-fg/20 bg-transparent px-4 py-2 text-pri-fg transition hover:bg-pri-fg/10'>
              View Lookbook
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

