'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Prisma } from '@prisma/client'
import { CldImage } from 'next-cloudinary'

type BagItemWithDetails = Prisma.bagGetPayload<{
  include: {
    product: true
    variant_color: true
    variant_size: true
  }
}>

interface OrderSummaryProps {
  items: BagItemWithDetails[]
}

export default function OrderSummary({ items: initialItems }: OrderSummaryProps) {
  const [items, setItems] = useState(initialItems)
  const [subtotal, setSubtotal] = useState(0)
  const shippingFee = 100 // Example fixed shipping fee

  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    setSubtotal(newSubtotal)
    setItems(initialItems)
  }, [items, initialItems])

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-4 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <CldImage
              src={item.variant_color.images[0]}
              alt={item.product.name}
              width={50}
              height={50}
              className="rounded-md"
            />
            <div className="flex-grow">
              <h3 className="font-semibold text-sm">{item.product.name}</h3>
              <p className="text-xs text-gray-500">
                Color: {item.variant_color.color}, Size: {item.variant_size?.size}
              </p>
              <p className="text-sm">Quantity: {item.quantity}</p>
            </div>
            <span className="text-sm font-medium">₱{(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₱{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping Fee</span>
          <span>₱{shippingFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₱{(subtotal + shippingFee).toFixed(2)}</span>
        </div>
      </div>
      <Button className="w-full">Place Order</Button>
    </div>
  )
}

