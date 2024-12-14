import { CategoryFilter } from "@/components/shop/category-filter";
import { ProductList } from "@/components/shop/product-list";
import { SearchBar } from "@/components/shop/search-bar";
import { Suspense } from "react";

export default function Shop({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const query = typeof searchParams.q === "string" ? searchParams.q : "";
	const category =
		typeof searchParams.category === "string" ? searchParams.category : "";

	return (
		<section className="container cpy flex flex-col md:flex-row gap-8">
			<aside className="w-full md:w-1/4">
				<CategoryFilter />
			</aside>

			<div className="w-full md:w-3/4">
				<SearchBar initialQuery={query} />
				<Suspense fallback={<div>Loading...</div>}>
					<ProductList query={query} category={category} />
				</Suspense>
			</div>
		</section>
	);
}
