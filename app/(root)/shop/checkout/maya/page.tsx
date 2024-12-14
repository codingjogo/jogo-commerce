import Image from "next/image";
import React from "react";
import MAYA from "@/public/payment-methods/maya.jpg";

const Maya = () => {
	return (
		<div className="relative h-screen aspect-square">
			<Image src={MAYA} alt="Maya-image" className="object-cover" />
		</div>
	);
};

export default Maya;
