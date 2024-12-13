import ProductDetails from '@/components/shop/product/product-details'
import ReviewSection from '@/components/shop/product/review-section'
import prisma from '@/lib/db'
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation'

async function getProduct(productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId },
    include: {
      category: true,
      variant_color: {
        include: {
          variant_size: true
        }
      }
    }
  });

  if (!product) {
    notFound();
  }

  return product;
}


export default async function ProductDetailsPage({ params }: { params: { productId: string } }) {
  const { userId } = await auth()
  const product = await getProduct(params.productId);
  const userFromDB = await prisma.user.findFirst({
    where: {
      clerk_user_id: userId!
    }
  })
  const bagItems = await prisma.bag.findMany({
    where: {
      user_id: userFromDB?.id
    },
    include: {
      product: true,
      variant_color: true,
      variant_size: true
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} bagItems={bagItems} />
      <ReviewSection productId={product.id} />
    </div>
  );
}
