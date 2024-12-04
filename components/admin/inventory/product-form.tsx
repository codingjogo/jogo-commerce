"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TrashIcon } from "lucide-react";

enum COLOR_SIZES {
  XS = "XS",
S = "S",
M = "M",
L = "L",
XL = "XL",
XXL = "XXL",
XXXL = "XXXL",
XXXXL = "XXXXL",
}

// Define the product schema
const productSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	slug: z.string().min(2, "Slug must be at least 2 characters"),
	sku: z.string().min(2, "SKU must be at least 2 characters"),
	description: z.string().optional(),
	status: z.enum(["ACTIVE", "DISCONTINUED"]),
	category_id: z.string().uuid(),
	price: z.number().positive("Price must be positive"),
	variant_colors: z.array(
		z.object({
			color: z.string().min(1, "at least 1 color"),
			images: z.array(z.string()),
			variant_sizes: z
				.array(
					z.object({
						size: z.nativeEnum(COLOR_SIZES),
						stock: z
							.number()
							.int()
							.nonnegative("Stock must be non-negative"),
					})
				)
				.min(1, "at least 1 variant size"),
		})
	),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
	product?: ProductFormValues;
}

export default function ProductForm({ product }: ProductFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteColorIndex, setDeleteColorIndex] = useState<number | null>(null)
  const [deleteSizeIndices, setDeleteSizeIndices] = useState<{ colorIndex: number, sizeIndex: number } | null>(null)

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues: product || {
			name: "",
			slug: "",
			sku: "",
			description: "",
			status: "ACTIVE",
			category_id: "",
			price: 0,
			variant_colors: [
				{
					color: "",
					images: [],
					variant_sizes: [
						{
							size: "" as COLOR_SIZES,
							stock: 0,
						},
					],
				},
			],
		},
	});

  const handleDeleteColor = (index: number) => {
    const colors = form.getValues('variant_colors')
    colors.splice(index, 1)
    form.setValue('variant_colors', colors)
    setDeleteColorIndex(null)
  }

  const handleDeleteSize = (colorIndex: number, sizeIndex: number) => {
    const sizes = form.getValues(`variant_colors.${colorIndex}.variant_sizes`)
    sizes.splice(sizeIndex, 1)
    form.setValue(`variant_colors.${colorIndex}.variant_sizes`, sizes)
    setDeleteSizeIndices(null)
  }

	const onSubmit = async (data: ProductFormValues) => {
		setIsSubmitting(true);
		try {
			const response = await axios.post("/api/inventory", data);
			if (response.status === 200) {
				toast("Product created");
				setTimeout(() => {
					router.refresh();
					router.push("/inventory");
				}, 3000);
			} else {
			}
		} catch (error) {
			console.log("ERROR WHILE CREATING THE PRODUCT", error);
			toast("An error occurred while creating the product.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Product Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="slug"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Slug</FormLabel>
							<FormControl>
								<Input {...field} disabled={true} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="sku"
					render={({ field }) => (
						<FormItem>
							<FormLabel>SKU</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a status" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="ACTIVE">
										Active
									</SelectItem>
									<SelectItem value="DISCONTINUED">
										Discontinued
									</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="category_id"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a category" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{/* Replace with actual categories from your database */}
									<SelectItem value="category-1-uuid">
										Category 1
									</SelectItem>
									<SelectItem value="category-2-uuid">
										Category 2
									</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="price"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Price</FormLabel>
							<FormControl>
								<Input
									type="number"
									{...field}
									onChange={(e) =>
										field.onChange(
											parseFloat(e.target.value)
										)
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Variant Colors and Sizes */}
				{form.watch("variant_colors").map((color, colorIndex) => (
					<div
						key={colorIndex}
						className="border p-4 rounded-md space-y-4"
					>
						<FormField
							control={form.control}
							name={`variant_colors.${colorIndex}.color`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Color</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Image Upload */}
						<div>
							<FormLabel>Images</FormLabel>
							<CldUploadWidget
								uploadPreset="soule-psycle-products"
								// eslint-disable-next-line
								onSuccess={(results: any) => {
									const currentImages =
										form.getValues(
											`variant_colors.${colorIndex}.images`
										) || [];
									form.setValue(
										`variant_colors.${colorIndex}.images`,
										[
											...currentImages,
											results.info.public_id,
										]
									);
								}}
							>
								{({ open }) => (
									<Button
										type="button"
										onClick={() => open()}
									>
										Upload Images
									</Button>
								)}
							</CldUploadWidget>
							<div className="mt-2 flex flex-wrap gap-2">
								{form
									.watch(
										`variant_colors.${colorIndex}.images`
									)
									.map((image, imageIndex) => (
										<Image
											key={imageIndex}
											src={image}
											alt={`Uploaded ${imageIndex}`}
											className="w-20 h-20 object-cover"
										/>
									))}
							</div>
						</div>

						{/* Variant Sizes */}
						{color.variant_sizes.map((size, sizeIndex) => (
							<div key={sizeIndex} className="flex gap-4">
								<FormField
									control={form.control}
									name={`variant_colors.${colorIndex}.variant_sizes.${sizeIndex}.size`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Size</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a size" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{[
														"XS",
														"S",
														"M",
														"L",
														"XL",
														"XXL",
														"XXXL",
														"XXXXL",
													].map((sizeOption) => (
														<SelectItem
															key={sizeOption}
															value={sizeOption}
															disabled={color.variant_sizes.some(
																(s, i) =>
																	i !==
																		sizeIndex &&
																	s.size ===
																		sizeOption
															)}
														>
															{sizeOption}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name={`variant_colors.${colorIndex}.variant_sizes.${sizeIndex}.stock`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Stock</FormLabel>
											<FormControl>
												<Input
													type="number"
													{...field}
													onChange={(e) =>
														field.onChange(
															parseInt(
																e.target.value,
																10
															)
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

<Dialog 
                  open={deleteSizeIndices?.colorIndex === colorIndex && deleteSizeIndices?.sizeIndex === sizeIndex} 
                  onOpenChange={() => setDeleteSizeIndices(null)}
                >
                  <DialogTrigger asChild>
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon"
                      onClick={() => setDeleteSizeIndices({ colorIndex, sizeIndex })}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure you want to delete this size variant?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button type="button" variant="secondary" onClick={() => setDeleteSizeIndices(null)}>Cancel</Button>
                      <Button type="button" variant="destructive" onClick={() => handleDeleteSize(colorIndex, sizeIndex)}>Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
							</div>
						))}

						<Button
							type="button"
							variant="outline"
							onClick={() => {
								const currentSizes = form.getValues(
									`variant_colors.${colorIndex}.variant_sizes`
								);
								form.setValue(
									`variant_colors.${colorIndex}.variant_sizes`,
									[...currentSizes, { size: "XS" as COLOR_SIZES, stock: 0 }]
								);
							}}
						>
							Add Size
						</Button>

            <Dialog open={deleteColorIndex === colorIndex} onOpenChange={() => setDeleteColorIndex(null)}>
              <DialogTrigger asChild>
                <Button type="button" variant="destructive" onClick={() => setDeleteColorIndex(colorIndex)}>
                  Delete Color Variant
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete this color variant?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. All sizes and images for this color will be deleted.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setDeleteColorIndex(null)}>Cancel</Button>
                  <Button type="button" variant="destructive" onClick={() => handleDeleteColor(colorIndex)}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
					</div>
				))}

				<Button
					type="button"
					variant="outline"
					onClick={() => {
						const currentColors = form.getValues("variant_colors");
						form.setValue("variant_colors", [
							...currentColors,
							{ color: "", images: [], variant_sizes: [] },
						]);
					}}
				>
					Add Color Variant
				</Button>

				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Creating..." : "Create Product"}
				</Button>
			</form>
		</Form>
	);
}
