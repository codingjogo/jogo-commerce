'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star } from 'lucide-react'
import axios from 'axios'
import { review } from '@prisma/client'
import { Toaster } from 'react-hot-toast'

export default function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<review[]>([])
  const [newReview, setNewReview] = useState('')
  const [rating, setRating] = useState(0)



  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await axios.get(`/api/reviews?productId=${productId}`)
  
        if (data.status === 200) {
          setReviews(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch reviews', error)
      }
    }
    fetchReviews()
  }, [productId])

  return (
    <>
      <Toaster 
        toastOptions={{
          duration: 2900
        }}
      />
      <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Existing Reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center gap-2 mb-2">
                {/* <Avatar>
                  <AvatarFallback>{review.author[0]}</AvatarFallback>
                </Avatar> */}
                <div>
                  {/* <p className="font-semibold">{review}</p> */}
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-1">{review.content}</p>
              <p className="text-sm text-gray-400">{(review.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
      )}

      {/* Submit New Review */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

        {/* Star Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              onClick={() => setRating(i + 1)}
              className={`h-6 w-6 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              <Star />
            </button>
          ))}
        </div>

        <Textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Share your thoughts about this product..."
          className="mb-4"
        />
        <Button>
          {'Submit Review'}
        </Button>
      </div>
    </div>
    </>
  )
}
