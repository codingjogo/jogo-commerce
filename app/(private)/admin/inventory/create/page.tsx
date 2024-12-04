import ProductForm from "@/components/admin/inventory/product-form";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function InventoryCreate() {
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
				<ProductForm />
			</div>
		</section>
	);
}
