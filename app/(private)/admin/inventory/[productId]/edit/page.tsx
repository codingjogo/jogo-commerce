import ProductForm from "@/components/admin/inventory/product-form";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import prisma from "@/lib/db";

export default async function InventoryEdit({
	params,
}: {
	params: {
		productId: string;
	};
}) {
	const productId = params.productId;
	const categories = await prisma.category.findMany();

	const product = (await prisma.product.findFirst({
		where: { id: productId },
		include: {
			variant_color: {
				include: {
					variant_size: true,
				},
			},
		},
	})) as // eslint-disable-next-line
	any;

	if (!product) {
		return <div>Product not found.</div>;
	}

	return (
		<section className="admin-content">
			<div className="grid gap-4">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/admin/inventory">
								Inventory
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Create Product</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<h1>Update Product</h1>
			</div>

			<div className="content">
				<ProductForm product={product} categories={categories} />
			</div>
		</section>
	);
}
