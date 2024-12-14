"use client";

import React from "react";
import {
	SubmitHandler,
	useFieldArray,
	useForm,
	useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import toast, { Toaster } from "react-hot-toast";

import { PlusCircleIcon } from "lucide-react";
import {
	PRODUCT_STATUS,
	productSchema,
	SIZE_STATUS,
	TProductFormValues,
} from "@/lib/schemas/productSchemas";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import VariantImages from "./variant-images";
import VariantSizes from "./variant-sizes";
import { stringToSlug } from "@/lib/helpers";
import { category } from "@prisma/client";

export default function ProductForm({
	product,
	categories,
}: {
	product?: TProductFormValues | null;
	categories: category[];
}) {
	const router = useRouter();

	const form = useForm<TProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues: product ? product : {
			name: "",
			slug: "",
			sku: "",
			description: "",
			status: "ACTIVE" as PRODUCT_STATUS,
			category_id: "",
			price: 0,
			variant_color: [
				{
					color: "",
					images: [],
					variant_size: [
						{
							size: null,
							stock: 0,
							status: "IN_STOCK" as SIZE_STATUS,
						},
					],
				},
			],
		},
	});

	const {
		fields: variantColorFields,
		append: variantColorAppend,
		remove: variantColorRemove,
	} = useFieldArray({
		control: form.control,
		name: "variant_color",
	});

	const watchName = useWatch({
		control: form.control,
		name: "name",
	});

	const isSubmitting = form.formState.isSubmitting;

	const onSubmit: SubmitHandler<TProductFormValues> = async (
    values: TProductFormValues
  ) => {
    try {
      const url = product
        ? `/api/admin/inventory/${product.id}` // Update specific product
        : `/api/admin/inventory`; // Create new product

      const method = product ? "put" : "post"; // Dynamic HTTP method

      const res = await axios({
        method,
        url,
        data: values,
      });

      if (res.status === 201 || res.status === 200) {
        const action = product ? "updated" : "created";
        toast.success(`Product ${action} successfully!`);

        setTimeout(() => {
          router.refresh();
          router.push("/admin/inventory");
        }, 3000);
      }
    } catch (error) {
      console.error("Error while submitting the product:", error);
      toast.error("An error occurred while submitting the product.");
    } finally {
			router.refresh();
			router.push("/admin/inventory");
		}
  };

	React.useEffect(() => {
		form.setValue("slug", stringToSlug(watchName));
	}, [form, watchName]);

	return (
		<>
			<Toaster 
			toastOptions={{
				duration: 2900
			}}			
			/>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 pb-12"
				>
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
									disabled={true}
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
										{categories.map((c) => {
											return (
												<SelectItem
													key={c.id}
													value={c.id}
												>
													{c.name}
												</SelectItem>
											);
										})}
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
										{...field}
										onChange={(e) =>
											field.onChange(
												Number(e.target.value)
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Variant Colors */}
					{variantColorFields.map((v_color, v_color_idx) => {
						return (
							<Card key={v_color.id}>
								<CardContent className="p-6 grid gap-4">
									<FormField
										control={form.control}
										name={`variant_color.${v_color_idx}.color`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Color</FormLabel>
												<FormControl>
													<Input placeholder="Red" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<VariantImages
										form={form}
										v_color_idx={v_color_idx}
									/>

									<VariantSizes
										form={form}
										v_color_idx={v_color_idx}
									/>
								</CardContent>

								{variantColorFields.length > 1 && (
									<CardFooter>
										<Button
											type="button"
											variant={"destructive"}
											onClick={() =>
												variantColorRemove(v_color_idx)
											}
										>
											<PlusCircleIcon />
											Remove Variant Color
										</Button>
									</CardFooter>
								)}
							</Card>
						);
					})}

					<Button
						type="button"
						variant={"secondary"}
						onClick={() => {
							variantColorAppend({
								color: "",
								images: [],
								variant_size: [
									{
										size: null,
										stock: 0,
										status: "IN_STOCK" as SIZE_STATUS,
									},
								],
							});
						}}
					>
						<PlusCircleIcon />
						Add Variant Color
					</Button>

					<Separator className="my-4" />

					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting && "Submitting..."}
						{product ? 'Update' : "Create"}
					</Button>
				</form>
			</Form>
		</>
	);
}
