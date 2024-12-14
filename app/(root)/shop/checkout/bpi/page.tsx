import Image from "next/image";
import React from "react";
import BPI from "@/public/payment-methods/bpi.jpg";

const Bpi = () => {
	return (
		<div className="relative h-screen aspect-square">
			<Image src={BPI} alt="GCASH-image" className="object-cover" />
		</div>
	);
};

export default Bpi;
