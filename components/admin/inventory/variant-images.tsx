"use client";

import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { TProductFormValues } from "@/lib/schemas/productSchemas";
import { Trash2 } from "lucide-react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import React from "react";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";

const VariantImages = ({
	form,
	v_color_idx,
}: {
	form: UseFormReturn<TProductFormValues>;
	v_color_idx: number;
}) => {
	const watchedImages = useWatch({
		control: form.control,
		// eslint-disable-next-line
		name: `variant_color.${v_color_idx}.images` as any,
	});

	const { append: variantColorImage } =
		useFieldArray({
			control: form.control,
			// eslint-disable-next-line
			name: `variant_color.${v_color_idx}.images` as any,
		});

	return (
		<div className="grid gap-6">
			<div>
				<FormLabel>Images</FormLabel>

				<div className="mt-2">
					<CldUploadWidget
						uploadPreset="soule-psycle-products"
						// eslint-disable-next-line
						onSuccess={(results: any) => {
							variantColorImage(results.info.public_id);
						}}
					>
						{({ open }) => {
							return (
								<Button type="button" onClick={() => open()}>
									Upload an Image
								</Button>
							);
						}}
					</CldUploadWidget>
				</div>
			</div>

			<div className="flex gap-4">
				{watchedImages.map(
					// eslint-disable-next-line
					(image: any, image_idx: number) => {
						return (
							<div
								key={image_idx}
								className="relative w-16 h-16 aspect-square"
							>
								<CldImage
									src={image}
									alt={`variant-image-${image}`}
									fill
									className="object-contain"
								/>
								<Button
									type="button"
									variant={"destructive"}
									className="absolute -top-2 -right-2 p-1 h-fit"
									onClick={() => {
										const updatedImages =
											watchedImages.filter(
												// eslint-disable-next-line
												(_: any, idx: number) =>
													idx !== image_idx
											);
										form.setValue(
											// eslint-disable-next-line
											`variant_color.${v_color_idx}.images` as any,
											updatedImages
										);
									}}
								>
									<Trash2 />
								</Button>
							</div>
						);
					}
				)}
			</div>
		</div>
	);
};

export default VariantImages;
