import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Assuming you're using Prisma

// GET: Fetch reviews for a specific product
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { product_id: productId },
      orderBy: { created_at: 'desc' }, // Sort by most recent reviews
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}