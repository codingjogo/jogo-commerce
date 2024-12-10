'use client';

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TProductList } from './product-list'
import { CldImage } from 'next-cloudinary'
import { Badge } from '../ui/badge';

export function ProductCard({ product }: { product: TProductList }) {
  console.log("product", product)

  return (
    <Link href={`/shop/product/${product.id}`} className="border rounded-lg overflow-hidden shadow-sm">
      <CldImage
        src={product.variant_color.map((vc) => vc.images)[0][0]}
        alt={product.name}
        width={300}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold mb-2">{product.name}</h3>
        <Badge variant={'outline'}>{product.category.name}</Badge>
        <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
        <Button asChild className="w-full">
          <Link href={`/product/${product.id}`}>View Details</Link>
        </Button>
      </div>
    </Link>
  )
}

