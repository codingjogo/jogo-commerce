"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/public/logo.jpg";
import { HomeIcon, MenuIcon, ShoppingBagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

const RootNav = () => {
  const [open, setOpen] = React.useState<boolean>(false);
	const pathname = usePathname();

	const NAV_LINKS = [
		{
			href: "/",
			label: "Home",
			icon: HomeIcon,
			isActive: pathname === "/",
		},
		{
			href: "/shop",
			label: "Shop",
			icon: ShoppingBagIcon,
			isActive: pathname === "/shop",
		},
	];

	return (
		<header className="container py-4 flex items-center justify-between">
			<Link href={"/"}>
				<Image
					src={Logo}
					alt="Soule-Pycle-Logo"
					width={64}
					height={64}
				/>
			</Link>
			{/* Large Screen Nav items */}
			<nav className="hidden lg:block">
				<ul className="flex items-center">
					{NAV_LINKS.map((link) => {
						const { href, icon: Icon, label, isActive } = link;

						return (
							<li key={href}>
								<Button
									type="button"
									variant={"ghost"}
									className={cn(
										"hover:underline hover:underline-offset-4 ps-8",
										isActive &&
											"underline underline-offset-4"
									)}
									asChild
								>
									<Link href={href}>
										<Icon />
										{label}
									</Link>
								</Button>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* Small Screen Nav Items */}
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger className="block lg:hidden">
					<MenuIcon />
				</SheetTrigger>
				<SheetContent className="w-full">
					<SheetHeader>
						<SheetTitle>SoulePsycle.com</SheetTitle>
						<SheetDescription>{""}</SheetDescription>
					</SheetHeader>

					<nav className="py-6">
						<ul className="flex flex-col items-end gap-12">
							{NAV_LINKS.map((link) => {
								const {
									href,
									icon: Icon,
									label,
									isActive,
								} = link;

								return (
									<li key={href}>
										<Button
											type="button"
											variant={"ghost"}
											className={cn(
												"hover:underline hover:underline-offset-4",
												isActive &&
													"underline underline-offset-4"
											)}
                      onClick={() => setOpen(!open)}
											asChild
										>
											<Link href={href}>
												<Icon />
												{label}
											</Link>
										</Button>
									</li>
								);
							})}
						</ul>
					</nav>
				</SheetContent>
			</Sheet>
		</header>
	);
};

export default RootNav;
