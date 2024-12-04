import { TAddress } from "@/lib/types";
import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { capitalizeWords } from "@/lib/helpers";

const YourDefaultAddress = ({ address }: { address: TAddress }) => {
	const {
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
					<CardTitle>{fullName}</CardTitle>
					<CardDescription>{email}</CardDescription>
				</CardHeader>
				<CardContent>
					{is_default && (
						<>
							<span className="text-muted-foreground">
								(Default)
							</span>
						</>
					)}{" "}
					{currAddress}
				</CardContent>
			</Card>
		</section>
	);
};

export default YourDefaultAddress;
