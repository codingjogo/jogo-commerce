"use client";

import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ProductDelete = ({ productId }: { productId: string }) => {
  const router = useRouter();


	const deleteProduct = async (id: string) => {
		try {
			const response = await axios.delete(`/api/admin/inventory?id=${id}`);
	
			if (response.status === 200) {
				toast.success("Product deleted successfully");

				setTimeout(() => {
					router.refresh();
				}, 3000);
			}
		} catch (error) {
			console.error("Error deleting product:", error);
			toast.error("Failed to delete product");
		}
	};

	return (
		<Button
      variant="destructive"
      className="w-full"
      onClick={() => deleteProduct(productId)}
    >
      Delete
    </Button>
	);
};

export default ProductDelete;
