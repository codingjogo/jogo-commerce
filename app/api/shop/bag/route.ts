import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {

	const { clerk_user_id, product_id, variant_color_id, variant_size_id, quantity } =
		await req.json();

	if (!product_id || !variant_color_id || !variant_size_id || !quantity) {
		return new NextResponse("REQUIRED_INPUT_FIELDS_SHOP_BAG_POST_ERROR", {
			status: 400,
		});
	}

	if (!clerk_user_id) {
    console.log('clerk_user_id', clerk_user_id)
		return new NextResponse("CLERK_ID_NOT_FOUND_SHOP_BAG_POST_ERROR", {
			status: 400,
		});
	}

	const userFromDB = await prisma.user.findFirst({
		where: {
			clerk_user_id: clerk_user_id,
		},
	});

	if (!userFromDB) {
		return new NextResponse("USER_NOT_FOUND_IN_DB_SHOP_BAG_POST_ERROR", {
			status: 400,
		});
	}

	try {
		const newBagItem = await prisma.bag.create({
			data: {
				user_id: userFromDB.id,
				product_id,
				variant_color_id,
				variant_size_id,
				quantity: 1,
			},
		});

		return new NextResponse(
			JSON.stringify({
				message: "Successfully Added the Product in Bag",
				newBagItem,
			}),
			{
				status: 200,
			}
		);
	} catch (error: // eslint-disable-next-line
	any) {
		console.log("SHOP_BAG_POST_ERROR", error.message);
		return new NextResponse("SHOP_BAG_POST_ERROR", {
			status: 500,
		});
	}
};
