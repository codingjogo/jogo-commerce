"use server";

import prisma from "@/lib/db";
import { TOnboardingFormValues } from "@/lib/schemas/onboardingSchemas";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async (
	validatedData: TOnboardingFormValues
) => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return { message: "No Logged In User" };
		}

		const client = await clerkClient();

		const userFromDB = await prisma.user.findUnique({
			where: {
				clerk_user_id: userId
			},
		});

		if (!userFromDB) {
			return { error: `User from DB not found! User: ${userId}`};
		}

		const userIdFromDB = userFromDB.id;

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
				isAcceptTermsAndConditions,
			},
		} = validatedData;

		const validatedNewDefaultAddress = {
			user_id: userIdFromDB,
			house_number,
			street,
			barangay,
			municipality,
			province,
			zip_code,
			is_default,
		};

		const res = await client.users.updateUser(userId, {
			publicMetadata: {
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
				isAcceptTermsAndConditions,
			},
		});

		const userFirstAddress = await prisma.address.create({
			data: validatedNewDefaultAddress,
		});

    const data = JSON.parse(JSON.stringify({
			message: res.publicMetadata,
			data: {
				res,
				userFirstAddress,
			},
		}))
    
		return data;
	} catch (err) {
		return { error: "There was an error updating the user metadata.", err };
	}
};
