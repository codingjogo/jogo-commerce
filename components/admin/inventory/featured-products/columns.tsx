"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { CldImage } from "next-cloudinary"
import RemoveFeaturedProduct from "./remove-featured-product"

export type Product = {
  id: string;
  image: string;
  name: string;
  price: number;
  variants: {
    id: string;
    color: string;
    size: string;
    stock: number;
  }[];
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "image",
    header: "Image",
    size: 80,
    cell: ({ row }) => {
      const productImage = row.original.image;

      return (
        <div className="relative w-12 aspect-square">
          <CldImage
            src={productImage}
            alt={`product-image-${productImage}`}
            sizes="48px"
            fill
            className="object-contain rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.original.price;

      return <span>${price.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.original.variants;

      return (
        <ul>
          {variants.map((variant) => {
            const { id, color, size } = variant;

            return (
              <li key={id} className="text-sm">
                <span className="font-semibold">{color}</span>, {size}
              </li>
            );
          })}
        </ul>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const productId = row.original.id

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <RemoveFeaturedProduct productId={productId} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
