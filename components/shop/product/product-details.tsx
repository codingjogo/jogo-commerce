'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart } from 'lucide-react';
import { Prisma } from '@prisma/client';
import { CldImage } from 'next-cloudinary';

export default function ProductDetails({
  product,
}: {
  product: Prisma.productGetPayload<{
    include: {
      category: true;
      variant_color: {
        include: {
          variant_size: true;
        };
      };
    };
  }>;
}) {

  // Check if size selection is needed (based on category)
  const isSizeRequired = product.category.name.toLowerCase() !== 'tote bag';

  // Initial states for selected color, size, and image
  const [selectedColor, setSelectedColor] = useState(product.variant_color[0]?.color || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(product.variant_color[0]?.images[0] || '/placeholder.svg');

  const selectedVariant = product.variant_color.find((variant) => variant.color === selectedColor);

  const handleColorChange = (color: string) => {
    const newVariant = product.variant_color.find((variant) => variant.color === color);
    if (newVariant) {
      setSelectedColor(color);
      setSelectedImage(newVariant.images[0] || '/placeholder.svg');
      setSelectedSize(''); // Reset size selection on color change
    }
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', {
      variantColorId: selectedVariant?.id,
      selectedSize: isSizeRequired ? selectedSize : null,
    });
  };

  const handleBuyNow = () => {
    console.log('Buy now:', {
      variantColorId: selectedVariant?.id,
      selectedSize: isSizeRequired ? selectedSize : null,
    });
  };

  const handleAddToWishlist = () => {
    console.log('Added to wishlist:', selectedVariant?.id);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Image Section */}
      <div className="space-y-4">
        <div className="aspect-square relative overflow-hidden rounded-lg">
          <CldImage
            src={selectedImage}
            alt={product.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {selectedVariant?.images.map((img, index) => (
            <div
              key={index}
              className="aspect-square relative overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <CldImage
                src={img}
                alt={`${product.name} Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl font-semibold">₱{product.price.toFixed(2)}</p>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-sm text-gray-500">Category: {product.category.name}</p>
        <p className="text-sm text-gray-500">SKU: {product.sku}</p>

        {/* Variant Color Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Color</h3>
          <div className="flex gap-2">
            {product.variant_color.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleColorChange(variant.color)}
                className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                  selectedColor === variant.color ? 'border-black' : 'border-transparent'
                }`}
              >
                <CldImage
                  src={variant.images[0]}
                  alt={variant.color}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Variant Size Selection (Conditional) */}
        {isSizeRequired && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Size</h3>
            <RadioGroup
              value={selectedSize}
              onValueChange={setSelectedSize}
              className="flex flex-wrap gap-2"
            >
              {selectedVariant?.variant_size.map((size) => (
                <div key={size.id}>
                  <RadioGroupItem
                    value={size.size || ''}
                    id={size.id}
                    className="peer sr-only"
                    disabled={size.stock === 0}
                  />
                  <Label
                    htmlFor={size.id}
                    className={`flex items-center justify-center rounded-md border px-3 py-2 text-sm peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white ${
                      size.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : ''
                    }`}
                  >
                    {size.size}
                    {size.stock <= 10 && size.stock > 0 && (
                      <span className="ml-2 text-xs text-red-500">(Low Stock)</span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={handleAddToCart} className="flex-1" disabled={isSizeRequired && !selectedSize}>
            Add to Cart
          </Button>
          <Button
            onClick={handleBuyNow}
            variant="outline"
            className="flex-1"
            disabled={isSizeRequired && !selectedSize}
          >
            Buy Now
          </Button>
          <Button onClick={handleAddToWishlist} variant="outline" size="icon">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
