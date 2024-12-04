import Image from "next/image";
import Logo from "@/public/logo.jpg";

export default function Inventory() {
	return (
		<section className="w-full h-screen flex items-center justify-center">
			<Image src={Logo} alt="Soule-Psycle-Logo" width={80} height={80} />
		</section>
	);
}
