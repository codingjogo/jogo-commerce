import CheckoutForm from "@/components/shop/checkout/checkout-form";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

async function getBagItems(userId: string) {
	const userFromDB = await prisma.user.findFirst({
		where: {
			clerk_user_id: userId,
		},
	});

	const bagItems = await prisma.bag.findMany({
		where: { user_id: userFromDB?.id },
		include: {
			product: true,
			variant_color: true,
			variant_size: true,
		},
	});
	return bagItems;
}

async function getAddress(userId: string) {
	const userFromDB = await prisma.user.findFirst({
		where: {
			clerk_user_id: userId,
		},
	});

	const address = await prisma.address.findFirst({
		where: {
			user_id: userFromDB?.id,
		},
		include: {
			user: true,
		},
	});

	return address;
}

const Checkout = async () => {
	const { userId } = await auth();

	if (!userId) {
		redirect("/sign-in");
	}

	const bagItems = await getBagItems(userId);
	const address = await getAddress(userId);

	/*
	useFormContext - https://www.react-hook-form.com/api/useformcontext/
		- to share functions of form

*/

	return (
		<div className="container">
			<CheckoutForm bagItems={bagItems} address={address!} />
		</div>
	);
};

export default Checkout;
