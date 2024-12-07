'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

const categories = ['All', 'Tote Bag', 'Shirt']

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams)
    if (category === 'All') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      {categories.map((category) => (
        <Button
          key={category}
          variant="ghost"
          className="w-full justify-start"
          onClick={() => handleCategoryChange(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}

