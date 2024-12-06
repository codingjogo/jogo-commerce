"use client";

import Image from "next/image";
import React from "react";
import Logo from "@/public/logo.jpg";
import { usePathname, useRouter } from "next/navigation";
import {
	LayoutDashboard,
	ListOrderedIcon,
	LogOutIcon,
	Package2,
	SettingsIcon,
	UserRoundIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const AdminNav = () => {
	const router = useRouter();
	const pathname = usePathname();

	const NAV_LINKS = [
		{
			href: "/admin",
			label: "Dashboard",
			icon: LayoutDashboard,
			isActive: pathname === "/admin",
		},
		{
			href: "/admin/inventory",
			label: "Inventory",
			icon: Package2,
			isActive: pathname === "/admin/inventory",
		},
		{
			href: "/admin/orders",
			label: "Orders",
			icon: ListOrderedIcon,
			isActive: pathname === "/admin/orders",
		},
		{
			href: "/admin/customers",
			label: "Customers",
			icon: UserRoundIcon,
			isActive: pathname === "/admin/customers",
		},
	];

	return (
		<aside className="w-64 p-2 bg-background h-full flex flex-col gap-2">
			{/* Logo Image */}
			<div className="logo relative w-full aspect-square">
				<Image
					src={Logo}
					alt="Soule-Psycle-Logo"
					fill={true}
					sizes="256px"
					className="object-contain cursor-pointer"
					onClick={() => router.push("/")}
				/>
			</div>
			{/* Nav Items */}
			<div className="flex-1 flex flex-col justify-between">
				<nav className="nav">
					<ul className="grid gap-1">
						{NAV_LINKS.map((link) => {
							const { href, icon: Icon, label, isActive } = link;

							return (
								<li key={href}>
									<Button
										type="button"
										className={cn(
											"w-full justify-start py-6",
											isActive
												? "bg-foreground text-white"
												: "bg-secondary hover:bg-foreground hover:text-white"
										)}
										variant={"ghost"}
										asChild
									>
										<Link href={href}>
											<Icon size={38} />
											{label}
										</Link>
									</Button>
								</li>
							);
						})}
					</ul>
				</nav>

				{/* Settings and Logout */}
				<div className="nav-footer bg-secondary flex justify-between p-1">
					<Button
						type="button"
						variant={"ghost"}
						className="bg-background"
					>
						<SettingsIcon />
					</Button>

					<Button type="button" variant={"destructive"}>
						<LogOutIcon />
					</Button>
				</div>
			</div>
		</aside>
	);
};

export default AdminNav;
