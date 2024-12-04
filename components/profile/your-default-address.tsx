'use client';

import { TAddressWithUser } from "@/lib/types";
import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { capitalizeWords } from "@/lib/helpers";
import { Button } from "../ui/button";
import Link from "next/link";
import { PencilIcon } from "lucide-react";

const YourDefaultAddress = ({ address }: { address: TAddressWithUser }) => {

	const {
		id: addressId,
		house_number,
		street,
		barangay,
		municipality,
		province,
		zip_code,
		is_default,
		user: { email, first_name, last_name },
	} = address;

	const fullName = capitalizeWords(`${first_name} ${last_name}`);
	const currAddress = `${house_number} ${street} St. Brgy. ${barangay} ${municipality} ${province} ${zip_code}`;

	return (
		<section className="container pb-24">
			<h2 className="mb-6">Your Default Address</h2>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
					<div>
						{fullName}
					</div>
					<Button type="button" variant={'outline'} asChild>
						<Link href={`/profile/addresses/${addressId}/edit`}>
							<PencilIcon />
						</Link>
					</Button>
					</CardTitle>
					<CardDescription>{email}</CardDescription>
				</CardHeader>
				<CardContent className="flex items-center justify-between">
					<div>
						{is_default && (
							<>
								<span className="text-muted-foreground">
									(Default)
								</span>
							</>
						)}{" "}
						{currAddress}
					</div>
					
				</CardContent>
			</Card>
		</section>
	);
};

export default YourDefaultAddress;
