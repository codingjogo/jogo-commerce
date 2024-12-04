import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-foreground text-background py-8 px-4">
			<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
				<div>
					<h3 className="font-semibold mb-4">About Us</h3>
					<p className="text-sm text-background">
						SoulePsycle is your destination for unique, expressive
						clothing that speaks to your soul.
					</p>
				</div>
				<div>
					<h3 className="font-semibold mb-4">Quick Links</h3>
					<ul className="space-y-2">
						<li>
							<Link
								href="/shop"
								className="text-sm text-background hover:underline"
							>
								Shop
							</Link>
						</li>
						<li>
							<Link
								href="/about"
								className="text-sm text-background hover:underline"
							>
								About
							</Link>
						</li>
						<li>
							<Link
								href="/contact"
								className="text-sm text-background hover:underline"
							>
								Contact
							</Link>
						</li>
						<li>
							<Link
								href="/faq"
								className="text-sm text-background hover:underline"
							>
								FAQ
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<h3 className="font-semibold mb-4">Contact Us</h3>
					<p className="text-sm text-background">
						Email: soulepsycle1201@gmail.com
						<br />
						Phone: +63 960 388 5090
						<br />
						Address: 123 Tabing Kanto St. Lucena, City
					</p>
				</div>
			</div>
			<div className="mt-8 text-center text-sm text-background">
				© {new Date().getFullYear()} SoulePsycle.com. All rights
				reserved.
			</div>
		</footer>
	);
}
