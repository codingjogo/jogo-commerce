"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { CldImage } from "next-cloudinary";
import ProductDelete from "./product-delete";
import SetAsFeatured from "./set-as-featured";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
	id: string;
	image: string;
	name: string;
	category: string;
	variants: {
		id: string;
		color: string;
		size: string;
		stock: number;
		status: string;
	}[];
};

export const columns: ColumnDef<Product>[] = [
	{
		accessorKey: "image",
		header: "Image",
		size: 240,
		cell: ({ row }) => {
			const productImage = row.original.image;

			return (
				<div className="relative w-12 aspect-square">
					<CldImage
						src={productImage}
						alt={`product-image-${productImage}`}
						sizes="48px"
						fill
						className="object-contain"
					/>
				</div>
			);
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Name" />;
		},
	},
	{
		accessorKey: "category",
		header: "Category",
		cell: ({ row }) => {
			const categoryName = row.original.category;

			return (
				<div>
					<Badge>{categoryName}</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: "variants",
		header: "Variants",
		cell: ({ row }) => {
			const variants = row.original.variants.map((v) => v);

			return (
				<div>
					<ul>
						{variants.map((v) => {
							const { id, color, size, stock } = v;

							return (
								<li key={id}>
									{color}, {size},{" "}
									<span
										className={cn(
											"font-bold",
											stock > 10 && "text-orange-500",
											stock > 30 && "text-green-500",
											stock < 10 && "text-red-500"
										)}
									>
										{stock}
									</span>
								</li>
							);
						})}
					</ul>
				</div>
			);
		},
	},
	{
		accessorKey: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const productId = row.original.id;

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
							<Button type="button" asChild>
								<Link
									href={`/admin/inventory/${productId}/edit`}
								>
									Edit
								</Link>
							</Button>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<SetAsFeatured productId={productId} />
						</DropdownMenuItem>
						<DropdownMenuSeparator />

						<DropdownMenuItem asChild>
							<ProductDelete productId={productId} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
