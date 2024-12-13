import prisma from "@/lib/db";
import { bagSchema } from "@/lib/schemas/bagSchemas";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
	const { searchParams } = new URL(req.url)
		const userId = searchParams.get('userId');

		if (!userId) {
			return new NextResponse("USER_ID_NOT_FOUND_SHOP_BAG_GET_ERROR", {
				status: 400,
			});
		}

		const userFromDB = await prisma.user.findFirst({
			where: {
				clerk_user_id: userId
			}
		})

		if (!userFromDB) {
			return new NextResponse("USER_FROM_DB_NOT_FOUND_SHOP_BAG_GET_ERROR", {
				status: 400,
			});
		}

		const userFromDBId = userFromDB.id;

	try {
		const bagItems = await prisma.bag.findMany({
			where: {
				user_id: userFromDBId
			},
			include: {
				product: {
					include: {
						category: true,
						variant_color: {
							include: {
								variant_size: true
							}
						}
					}
				}
			}
		})

		return new NextResponse(JSON.stringify({
			message:"Fetching Bag Items Successfully!",
			bagItems
		}), {
			status: 200,
		});
	} catch (error: // eslint-disable-next-line
		any) {
			console.log("SHOP_BAG_GET_ERROR", error.message);
			return new NextResponse("SHOP_BAG_GET_ERROR", {
				status: 500,
			});
		}
}

export const POST = async (req: Request) => {
	const json = await req.json();

	const validatedData = bagSchema.parse(json);

	const { user_id, product_id, variant_color_id, variant_size_id } =
		validatedData;

	const userFromDB = await prisma.user.findFirst({
		where: {
			clerk_user_id: user_id
		}
	})

	const userFromDBID = userFromDB?.id;

	if (!userFromDBID) {
		return new NextResponse("USER_ID_FROM_DB_NOT_FOUND!_SHOP_BAG_POST_ERROR", {
			status: 500,
		});
	}

	try {
		const existingBagItem = await prisma.bag.findFirst({
			where:{
				user_id: userFromDBID,
				variant_size_id,
			}
		})

		if (existingBagItem) {
			const updatedBagItem = await prisma.bag.update({
				where: {
					id: existingBagItem.id,
				},
				data: {
					updated_at: new Date(),
					quantity: {
						increment: 1
					}
				}
			})

			return new NextResponse(
				JSON.stringify({
					message: "Successfully Updated the Existing Product in the Bag",
					updatedBagItem,
				}),
				{
					status: 200,
				}
			);
		}

		const newBagItem = await prisma.bag.create({
			data: {
				user_id: userFromDBID,
				product_id,
				variant_color_id,
				variant_size_id: variant_size_id ?? null,
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
