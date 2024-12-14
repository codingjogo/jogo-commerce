import prisma from "@/lib/db";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const category = searchParams.get("category");
	const query = searchParams.get("q")?.toLowerCase() || "";
	try {
		// eslint-disable-next-line
		const whereCondition: any = {
			AND: [
				category ? { category: { name: category } } : {},
				query ? { name: { contains: query, mode: "insensitive" } } : {},
			],
		};

		const products = await prisma.product.findMany({
			where: whereCondition,
			include: {
				category: true,
				variant_color: true,
			},
		});

		// Respond with the products
		return new Response(JSON.stringify(products), { status: 200 });
	} catch (error) {
		console.error("Error fetching products:", error);
		return new Response(
			JSON.stringify({ error: "Failed to fetch products" }),
			{ status: 500 }
		);
	}
}
