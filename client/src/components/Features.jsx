import { Headphones, Shield, Truck } from 'lucide-react'
import React from 'react'

const Features = () => {
  return (
    <>
    <section className='bg-muted/50 py-12'>
    <div className='max-w-7xl mx-auto px-4'>
        <div className='grid md:grid-cols-3 gap-8'>
            <div className='flex items-center space-x-4'>
                <div className='bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center'>
                    <Truck className='h-6 w-6 text-blue-600'/>
                    </div>

            <div>
                <h3 className='font-semibold'>Free Shipping</h3>
                <p className='text-muted-foreground'>On all orders over $50</p>
            </div>
             </div>
           {/* 2nd div */}

 <div className='flex items-center space-x-4'>
                <div className='bg-green-100 w-12 h-12 rounded-full flex items-center justify-center'>
                    <Shield className='h-6 w-6 text-green-600'/>
                    </div>

            <div>
                <h3 className='font-semibold'>Secure Payments</h3>
                <p className='text-muted-foreground'>100% Secure Transaction</p>
            </div>
             </div>

{/* 
             3rd div */}

              <div className='flex items-center space-x-4'>
                <div className='bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center'>
                    <Headphones className='h-6 w-6 text-purple-600'/>
                    </div>

            <div>
                <h3 className='font-semibold'>24/7 Support</h3>
                <p className='text-muted-foreground'>Customer support available anytime</p>
            </div>
             </div>


        </div>
    </div>
    </section>
    </>
  )
}

export default Features