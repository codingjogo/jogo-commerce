import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
	return (
		<section className="bg-background text-center py-20 px-4">
			<h1 className="text-4xl font-bold mb-4">SoulePsycle.com</h1>
			<p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
				[soul•cycle]shouting your sighs. All our designs are copyright
				of our store. DO NOT REPRINT.
			</p>
			<Button asChild size="lg">
				<Link href="/shop">Shop Now!</Link>
			</Button>
		</section>
	);
}
