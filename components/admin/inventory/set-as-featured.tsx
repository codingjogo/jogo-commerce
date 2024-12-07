'use client';

import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

const SetAsFeatured = ({ productId }: { productId: string }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/admin/inventory/featured-products', {
        productId,
      });

      if (response.status === 201) {
        toast.success('Product successfully added to featured list.');
      } else {
        toast.error(response.data?.message || 'Failed to add product to featured list.');
      }
    } catch (error) {
      console.error('Error adding product to featured list:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" className="w-full" variant="outline">
        Mark as Featured
      </Button>
    </form>
  );
};

export default SetAsFeatured;
