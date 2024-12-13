'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Prisma } from '@prisma/client'
import { Trash2 } from 'lucide-react'
import { CldImage } from 'next-cloudinary'
import axios from 'axios'

type BagItemWithDetails = Prisma.bagGetPayload<{
  include: {
    product: true
    variant_color: true
    variant_size: true
  }
}>

interface BagItemListProps {
  items: BagItemWithDetails[]
}

export default function BagItemList({ items: initialItems }: BagItemListProps) {
  const [bagItems, setBagItems] = useState(initialItems)

  const removeItem = async (id: string) => {
    // Optimistic UI Update
    const previousItems = [...bagItems];
    setBagItems(prevItems => prevItems.filter(item => item.id !== id));
  
    try {
      const response = await axios.delete(`/api/shop/bag/delete-item?bagItemId=${id}`)
  
      if (response.status !== 200) {
        throw new Error('Error removing bag item.')
      }
    } catch (error) {
      console.error(error);
      // Rollback UI Update
      setBagItems(previousItems);
    }
  };

  return (
    <div className="space-y-4">
      {bagItems.map((item) => (
        <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
          <CldImage
            src={item.variant_color.images[0]}
            alt={item.product.name}
            width={100}
            height={100}
            className="rounded-md"
          />
          <div className="flex-grow">
            <h3 className="font-semibold">{item.product.name}</h3>
            <p className="text-sm text-gray-500">
              Color: {item.variant_color.color}, Size: {item.variant_size?.size}
            </p>
            <p className="font-medium">₱{item.product.price.toFixed(2)}</p>
            <p className="text-sm">Quantity: {item.quantity}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

