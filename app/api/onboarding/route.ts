import prisma from "@/lib/db";
import { addressSchema } from "@/lib/schemas/addressSchemas";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
	try {
		const validatedData = await req.json();

		const { userId } = await auth();

		if (!userId) {
			return Response.json("No User ID Found!", {
				status: 400,
			});
		}

    console.log("User ID: ", userId)

		const userFromDB = await prisma.user.findFirst({
			where: {
				clerk_user_id: userId,
			},
		});

		if (!userFromDB) {
			return Response.json("User from DB not found!", {
				status: 400,
			});
		}

		const userIdFromDB = userFromDB.id;

    console.log("User ID from DB: ", userIdFromDB)

		const client = await clerkClient();

		if (!validatedData.success) {
			return Response.json("ZOD VALIDATION ERROR IN [onboardingSchema]!", {
				status: 400,
			});
		}

		const {
			metadata: {
				onboardingComplete,
				address: {
					house_number,
					street,
					barangay,
					municipality,
					province,
					zip_code,
					is_default,
				},
			},
		} = validatedData.data;

    const newDefaultAddress = {
      user_id: userIdFromDB,
      house_number,
      street,
      barangay,
      municipality,
      province,
      zip_code,
      is_default,
    }

    const validatedNewDefaultAddress = addressSchema.safeParse(newDefaultAddress);

    if (!validatedNewDefaultAddress.success) {
      return Response.json("ZOD VALIDATION ERROR IN [addressSchema]!", {
				status: 400,
			});
    }

		const updatedClerkMetadata = await client.users.updateUser(userId, {
			publicMetadata: {
				onboardingComplete,
				house_number,
				street,
				barangay,
				municipality,
				province,
				zip_code,
				is_default,
			},
		});

		const userFirstAddress = await prisma.address.create({
			data: validatedNewDefaultAddress.data,
		});

		return Response.json(
			{
				message: "POST ONBOARDING SUCCESSFUL",
				method: req.method,
				data: {
					updatedClerkMetadata,
					userFirstAddress,
				},
			},
			{
				status: 200,
			}
		);
	} catch (err) {
		console.log("FAILED_POST_ONBOARDING", err);
		return Response.json("FAILED_POST_ONBOARDING", {
			status: 400,
		});
	}
}
