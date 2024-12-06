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

export default async function InventoryCreate() {
	const categories = await prisma.category.findMany()

	return (
		<section className="admin-content">
			<div className="grid gap-4">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/admin/inventory">Inventory</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Create Product</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<h1>Create Product</h1>
			</div>

			<div className="content">
				<ProductForm categories={categories} />
			</div>
		</section>
	);
}
