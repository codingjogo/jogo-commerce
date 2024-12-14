'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from './product-card';
import axios from 'axios';
import { Prisma } from '@prisma/client';

export type TProductList = Prisma.productGetPayload<{
  include: {
    category: true,
    variant_color: true
  }
}>

export function ProductList({ query, category }: { query: string; category: string }) {
  const [products, setProducts] = useState<TProductList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch products from the API
        const response = await axios.get('/api/shop', {
          params: { query, category, q:query },
        });
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, category]);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="text-center py-8">No products found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
