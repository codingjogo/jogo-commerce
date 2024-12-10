'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

interface Review {
  id: string
  author: string
  rating: number
  content: string
  date: string
}

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'John Doe',
    rating: 5,
    content: 'Great product! Exactly as described and very comfortable.',
    date: '2023-05-15',
  },
  {
    id: '2',
    author: 'Jane Smith',
    rating: 4,
    content: 'Good quality, but the sizing runs a bit small.',
    date: '2023-05-10',
  },
  // Add more mock reviews as needed
]

export default function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState(mockReviews)
  const [newReview, setNewReview] = useState('')

  const handleSubmitReview = () => {
    // In a real application, you would send this to your backend
    const review: Review = {
      id: Date.now().toString(),
      author: 'Current User',
      rating: 5, // For simplicity, we're setting a default rating
      content: newReview,
      date: new Date().toISOString().split('T')[0],
    }
    setReviews([review, ...reviews])
    setNewReview('')
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Avatar>
                <AvatarFallback>{review.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{review.author}</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-1">{review.content}</p>
            <p className="text-sm text-gray-400">{review.date}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
        <Textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Share your thoughts about this product..."
          className="mb-4"
        />
        <Button onClick={handleSubmitReview}>Submit Review</Button>
      </div>
    </div>
  )
}

