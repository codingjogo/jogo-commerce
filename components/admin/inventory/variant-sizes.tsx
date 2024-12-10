"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	COLOR_SIZES,
	SIZE_STATUS,
	TProductFormValues,
} from "@/lib/schemas/productSchemas";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import React from "react";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const VariantSizes = ({
	form,
	v_color_idx,
}: {
	form: UseFormReturn<TProductFormValues>;
	v_color_idx: number;
}) => {
	const {
		fields: variantSizeFields,
		append: variantSizeAppend,
		remove: variantSizeRemove,
	} = useFieldArray({
		control: form.control,
		name: `variant_color.${v_color_idx}.variant_size`,
	});

	const watchedSizes = useWatch({
		control: form.control,
		// eslint-disable-next-line
		name: `variant_color.${v_color_idx}.variant_size` as any,
	});

	const watchedCategory = useWatch({
		control: form.control,
		name: `category_id`,
	});

	const isTotebag =
		watchedCategory === "b83c3f31-78be-4f56-84aa-19ea2a0f276e";

	// eslint-disable-next-line
	const selectedSizes = watchedSizes?.map((item: any) => item.size) || [];

	return (
		<div className="grid gap-4">
			{variantSizeFields.map((v_size, v_size_idx) => {
				const availableSizes = Object.values(COLOR_SIZES).filter(
					(size) =>
						!selectedSizes.includes(size) ||
						size === watchedSizes[v_size_idx]?.size
				);

				return (
					<Card key={v_size.id}>
						<CardContent className="p-6 grid gap-4">
							<FormField
								control={form.control}
								name={`variant_color.${v_color_idx}.variant_size.${v_size_idx}.size`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Size</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={
												field.value || "default"
											}
										>
											<FormControl>
												<SelectTrigger
													disabled={isTotebag}
												>
													<SelectValue placeholder="Select a size" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem
													key={"no-size"}
													value={"no-size"}
													disabled={true}
												>
													{"No Size Available"}
												</SelectItem>
												{availableSizes.map((size) => (
													<SelectItem
														key={size}
														value={size}
													>
														{size}
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
								name={`variant_color.${v_color_idx}.variant_size.${v_size_idx}.stock`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Stock</FormLabel>
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

							<FormField
								control={form.control}
								name={`variant_color.${v_color_idx}.variant_size.${v_size_idx}.status`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>

						<CardFooter className="flex flex-col items-start gap-2">
							{v_size_idx === variantSizeFields.length - 1 && (
								<Button
									type="button"
									variant={"secondary"}
									onClick={() => {
										variantSizeAppend({
											size: null,
											stock: 0,
											status: "IN_STOCK" as SIZE_STATUS,
										});
									}}
								>
									<PlusCircleIcon />
									Add Size
								</Button>
							)}

							{variantSizeFields.length > 1 && (
								<Button
									type="button"
									variant={"destructive"}
									onClick={() =>
										variantSizeRemove(v_size_idx)
									}
								>
									<Trash2Icon />
									Remove Size
								</Button>
							)}
						</CardFooter>
					</Card>
				);
			})}
		</div>
	);
};

export default VariantSizes;
