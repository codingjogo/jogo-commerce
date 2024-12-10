import ProductDetails from '@/components/shop/product/product-details'
import ReviewSection from '@/components/shop/product/review-section'
import prisma from '@/lib/db'
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
  const product = await getProduct(params.productId);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
      <ReviewSection productId={product.id} />
    </div>
  );
}
