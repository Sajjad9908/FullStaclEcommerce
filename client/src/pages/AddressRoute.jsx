import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addAddress, deleteAddress, setCart, setSelectedAddress as setSelectedAddressAction } from '@/redux/ProductSlice'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

const EMPTY_CART = {
  items: [],
  totalPrice: 0,
}

const EMPTY_ADDRESS_FORM = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: ''
}

const REQUIRED_ADDRESS_FIELDS = ['fullName', 'phone', 'email', 'address', 'city', 'state', 'zip', 'country']

const normalizeAddressPayload = (input = {}) => Object.fromEntries(
  REQUIRED_ADDRESS_FIELDS.map((field) => [field, String(input[field] ?? '').trim()])
)

const getMissingAddressField = (addressPayload) => REQUIRED_ADDRESS_FIELDS.find((field) => !addressPayload[field])

const PAYMENT_METHODS = [
  {
    value: 'cod',
    title: 'Cash on Delivery',
    description: 'Place the order now and collect payment when the parcel is delivered.',
  },
  {
    value: 'easypaisa',
    title: 'Easypaisa',
    description: 'Create the order and continue to Easypaisa using the backend payment payload.',
  },
]

const AddressRoute = () => {
  const dispatch = useDispatch()
  const { address = [], selectedAddress, cart } = useSelector((state) => state.products)
  const normalizedCart = cart && typeof cart === 'object' && Array.isArray(cart.items) ? cart : EMPTY_CART
  const selectedAddressData = selectedAddress !== null ? address[selectedAddress] : null
  const accessToken = localStorage.getItem('accessToken')

  const [formData, setFormData] = React.useState(EMPTY_ADDRESS_FORM)
  const [showForm, setShowForm] = useState(address.length > 0 ? false : true)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const [createdOrder, setCreatedOrder] = useState(null)
  const [paymentData, setPaymentData] = useState(null)

  const subTotal = Number(normalizedCart.totalPrice ?? 0)
  const shippingCharges = subTotal > 299 ? 0 : 10
  const tax = Number((subTotal * 0.05).toFixed(2))
  const total = Number((subTotal + shippingCharges + tax).toFixed(2))
  const itemCount = normalizedCart.items.length

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    const normalizedFormData = normalizeAddressPayload(formData)
    const missingField = getMissingAddressField(normalizedFormData)

    if (missingField) {
      toast.error(`Please fill ${missingField}`)
      return
    }

    dispatch(addAddress(normalizedFormData))
    setFormData(EMPTY_ADDRESS_FORM)
    setShowForm(false)
  }

  const resetCheckoutState = () => {
    setCreatedOrder(null)
    setPaymentData(null)
    setPaymentMethod('cod')
    setIsSubmittingOrder(false)
  }

  const handleCheckoutDialogChange = (open) => {
    setIsCheckoutOpen(open)

    if (!open) {
      resetCheckoutState()
    }
  }

  const handleOpenCheckout = () => {
    if (!selectedAddressData) {
      toast.error('Select a delivery address first')
      return
    }

    const normalizedSelectedAddress = normalizeAddressPayload(selectedAddressData)
    const missingField = getMissingAddressField(normalizedSelectedAddress)
    if (missingField) {
      toast.error(`Selected address is incomplete. Missing ${missingField}. Please add a complete address.`)
      return
    }

    if (!itemCount) {
      toast.error('Your cart is empty')
      return
    }

    handleCheckoutDialogChange(true)
  }

  const submitGatewayForm = (url, payload) => {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = url
    form.target = '_blank'

    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return
      }

      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = String(value)
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  const handleProceedToGateway = () => {
    if (!paymentData?.checkoutUrl) {
      toast.error('Gateway URL is missing from the payment response')
      return
    }

    const redirectUrl = paymentData.gatewayResponse?.paymentUrl || paymentData.gatewayResponse?.redirectUrl || paymentData.gatewayResponse?.url

    if (redirectUrl) {
      window.open(redirectUrl, '_blank', 'noopener,noreferrer')
      return
    }

    submitGatewayForm(paymentData.checkoutUrl, paymentData.payload || {})
  }

  const handlePlaceOrder = async () => {
    if (!accessToken) {
      toast.error('Login required to place an order')
      return
    }

    if (!selectedAddressData) {
      toast.error('Select a delivery address first')
      return
    }

    const shippingAddress = normalizeAddressPayload(selectedAddressData)
    const missingField = getMissingAddressField(shippingAddress)
    if (missingField) {
      toast.error(`Selected address is incomplete. Missing ${missingField}. Please add a complete address.`)
      return
    }

    setIsSubmittingOrder(true)

    try {
      const res = await axios.post(
        'https://full-stacl-ecommerce.vercel.app/api/v1/orders/create',
        {
          paymentMethod,
          shippingAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!res.data.success) {
        throw new Error(res.data.message || 'Failed to create order')
      }

      setCreatedOrder(res.data.order)
      setPaymentData(res.data.payment || null)

      if (paymentMethod === 'cod') {
        dispatch(setCart(EMPTY_CART))
        toast.success('Order placed successfully')
      } else {
        toast.success('Order created. Continue to Easypaisa to complete payment.')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to place order')
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  return (
    <>
      <div className='max-w-7xl mx-auto grid place-items-center px-4 pb-10'>
        <div className='grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-20 mt-10 max-w-7xl mx-auto w-full'>
          <div className='space-y-4 rounded-2xl border bg-white p-6 shadow-sm'>
            {showForm ? (
              <>
                <div>
                  <Label htmlFor='fullName'>Full Name</Label>
                  <Input
                    id='fullName'
                    name='fullName'
                    placeholder='Enter your full name'
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor='phone'>Phone</Label>
                  <Input
                    id='phone'
                    name='phone'
                    placeholder='Enter your phone number'
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    name='email'
                    placeholder='Enter your email'
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor='address'>Address</Label>
                  <Input
                    id='address'
                    name='address'
                    placeholder='Enter your address'
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                  <div>
                    <Label htmlFor='city'>City</Label>
                    <Input
                      id='city'
                      name='city'
                      value={formData.city}
                      placeholder='Enter your city'
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor='state'>State</Label>
                    <Input
                      id='state'
                      name='state'
                      value={formData.state}
                      placeholder='Enter your state'
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                  <div>
                    <Label htmlFor='zip'>Zip Code</Label>
                    <Input
                      id='zip'
                      name='zip'
                      value={formData.zip}
                      placeholder='Enter your zip code'
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor='country'>Country</Label>
                    <Input
                      id='country'
                      name='country'
                      value={formData.country}
                      placeholder='Enter your country'
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <Button onClick={handleSave} className='w-full bg-pink-600 hover:bg-pink-500'>Save and Continue</Button>
              </>
            ) : (
              <div className='space-y-4'>
                <h2 className='text-lg font-semibold'>Saved Address</h2>
                {address.length > 0 && (
                  address.map((addr, index) => (
                    <div
                      key={index}
                      onClick={() => dispatch(setSelectedAddressAction(index))}
                      className={`relative rounded-xl border p-4 cursor-pointer transition-colors ${selectedAddress === index ? 'border-pink-500 bg-pink-50' : 'border-gray-300 bg-white'}`}
                    >
                      <p className='font-medium'>{addr.fullName}</p>
                      <p className='font-medium'>{addr.phone}</p>
                      <p className='font-medium'>{addr.email}</p>
                      <p className='font-medium'>{addr.address} {addr.city}, {addr.state} {addr.zip}</p>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          dispatch(deleteAddress(index))
                        }}
                        variant='outline'
                        className='absolute top-2 right-2 text-red-500 hover:text-red-400'
                      >
                        Delete
                      </Button>
                    </div>
                  ))
                )}
                <Button variant='outline' className='w-full' onClick={() => setShowForm(true)}>+ Add new Address</Button>
                <Button
                  className='w-full bg-pink-600 hover:bg-pink-500'
                  disabled={selectedAddress === null || itemCount === 0}
                  onClick={handleOpenCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </div>

          <div>
            <Card className='w-full max-w-105 rounded-2xl shadow-sm'>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardContent className='space-y-4 px-0 pb-0'>
                  <div className='flex justify-between'>
                    <span>Subtotal {itemCount} items</span>
                    <span>${subTotal.toLocaleString()}</span>
                  </div>

                  <div className='flex justify-between'>
                    <span>Shipping</span>
                    <span>${shippingCharges}</span>
                  </div>

                  <div className='flex justify-between'>
                    <span>Tax</span>
                    <span>${tax.toLocaleString()}</span>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-lg font-bold'>Total</span>
                    <span className='text-lg font-bold'>${total.toLocaleString()}</span>
                  </div>

                  <div className='text-sm text-muted-foreground pt-4'>
                    <p>* free shipping on orders over $299</p>
                    <p>* 30 Days return policy</p>
                    <p>* 24/7 Customer Support</p>
                    <p>* secure checkout with ssl encryption</p>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isCheckoutOpen} onOpenChange={handleCheckoutDialogChange}>
        <DialogContent showCloseButton={false} className='max-w-2xl rounded-3xl border-0 bg-transparent p-0 shadow-none sm:max-w-2xl'>
          <Card className='border-0 bg-white shadow-2xl'>
            <CardHeader className='space-y-2 border-b bg-linear-to-br from-pink-50 to-white'>
              <DialogHeader>
                <DialogTitle className='text-2xl'>Checkout</DialogTitle>
                <DialogDescription>
                  {createdOrder
                    ? paymentMethod === 'easypaisa'
                      ? 'Your order is created. Continue to Easypaisa to complete the payment.'
                      : 'Your cash on delivery order has been created successfully.'
                    : 'Review your delivery details, choose a payment method, and place the order.'}
                </DialogDescription>
              </DialogHeader>
            </CardHeader>

            <CardContent className='space-y-6 p-6'>
              {!createdOrder ? (
                <>
                  <div className='rounded-2xl border bg-gray-50 p-4'>
                    <p className='text-sm text-muted-foreground'>Deliver to</p>
                    {selectedAddressData && (
                      <div className='mt-2 space-y-1'>
                        <p className='font-semibold'>{selectedAddressData.fullName}</p>
                        <p>{selectedAddressData.phone}</p>
                        <p>{selectedAddressData.email}</p>
                        <p>{selectedAddressData.address}, {selectedAddressData.city}, {selectedAddressData.state} {selectedAddressData.zip}</p>
                      </div>
                    )}
                  </div>

                  <div className='grid gap-3'>
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.value}
                        type='button'
                        onClick={() => setPaymentMethod(method.value)}
                        className={`rounded-2xl border p-4 text-left transition-all ${paymentMethod === method.value ? 'border-pink-500 bg-pink-50 shadow-sm' : 'border-gray-200 bg-white hover:border-pink-300'}`}
                      >
                        <div className='flex items-start justify-between gap-4'>
                          <div>
                            <p className='font-semibold'>{method.title}</p>
                            <p className='mt-1 text-sm text-muted-foreground'>{method.description}</p>
                          </div>
                          <div className={`mt-1 h-4 w-4 rounded-full border ${paymentMethod === method.value ? 'border-pink-600 bg-pink-600 ring-4 ring-pink-100' : 'border-gray-300 bg-white'}`} />
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className='rounded-2xl border bg-gray-50 p-4 space-y-2'>
                    <div className='flex items-center justify-between text-sm'>
                      <span>Items</span>
                      <span>{itemCount}</span>
                    </div>
                    <div className='flex items-center justify-between text-sm'>
                      <span>Subtotal</span>
                      <span>${subTotal.toLocaleString()}</span>
                    </div>
                    <div className='flex items-center justify-between text-sm'>
                      <span>Shipping</span>
                      <span>${shippingCharges.toLocaleString()}</span>
                    </div>
                    <div className='flex items-center justify-between text-sm'>
                      <span>Tax</span>
                      <span>${tax.toLocaleString()}</span>
                    </div>
                    <div className='flex items-center justify-between text-base font-semibold pt-2 border-t'>
                      <span>Total</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className='space-y-4'>
                  <div className='rounded-2xl border bg-gray-50 p-5'>
                    <p className='text-sm text-muted-foreground'>Order Reference</p>
                    <p className='mt-1 break-all text-lg font-semibold'>{createdOrder._id}</p>
                    <p className='mt-4 text-sm text-muted-foreground'>Payment Method</p>
                    <p className='mt-1 font-medium uppercase'>{paymentMethod}</p>
                    <p className='mt-4 text-sm text-muted-foreground'>Amount</p>
                    <p className='mt-1 text-xl font-semibold'>{createdOrder.currency || 'PKR'} {createdOrder.amount}</p>
                  </div>

                  {paymentMethod === 'easypaisa' && (
                    <div className='rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900'>
                      Easypaisa payload is ready. Use the button below to continue to the payment gateway in a new tab.
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            <DialogFooter className='border-t p-6 pt-4'>
              {createdOrder ? (
                <>
                  {paymentMethod === 'easypaisa' && (
                    <Button className='bg-emerald-600 hover:bg-emerald-500' onClick={handleProceedToGateway}>
                      Continue to Easypaisa
                    </Button>
                  )}
                  <Button variant='outline' onClick={() => handleCheckoutDialogChange(false)}>
                    Close
                  </Button>
                </>
              ) : (
                <>
                  <Button variant='outline' onClick={() => handleCheckoutDialogChange(false)}>
                    Cancel
                  </Button>
                  <Button className='bg-pink-600 hover:bg-pink-500' onClick={handlePlaceOrder} disabled={isSubmittingOrder}>
                    {isSubmittingOrder ? 'Placing Order...' : paymentMethod === 'easypaisa' ? 'Create Order' : 'Place Order'}
                  </Button>
                </>
              )}
            </DialogFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddressRoute
