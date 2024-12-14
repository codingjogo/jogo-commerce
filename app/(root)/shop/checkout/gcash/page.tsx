import Image from "next/image";
import React from "react";
import GCASH from "@/public/payment-methods/gcash.jpg";

const Gcash = () => {
	return (
		<div className="relative h-screen aspect-square">
			<Image src={GCASH} alt="GCASH-image" className="object-cover" />
		</div>
	);
};

export default Gcash;
