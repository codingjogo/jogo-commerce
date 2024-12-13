"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.jpg";
import {
	HomeIcon,
	MenuIcon,
	ShoppingBagIcon,
	UserRoundIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOutButton, useUser } from "@clerk/nextjs";

const RootNav = () => {
	const [open, setOpen] = React.useState<boolean>(false);

	const { user } = useUser();

	const userAvatarImg = user?.imageUrl || "";

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

	const AVATAR_LINKS = [
		{
			href: "/profile",
			label: "Profile",
			icon: UserRoundIcon,
		},
		{
			href: "/shop/bag",
			label: "Bag",
			icon: ShoppingBagIcon,
		},
	];

	return (
		<header className="bg-foreground text-background py-4">
			<div className="container flex items-center justify-between">
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
						<li>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Avatar>
										<AvatarImage src={userAvatarImg} />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuLabel>
										My Account
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{AVATAR_LINKS.map((link) => {
										const {
											href,
											icon: Icon,
											label,
										} = link;

										return (
											<DropdownMenuItem
												key={href}
												asChild
											>
												<Button
													type="button"
													className="w-full justify-start cursor-pointer"
													variant={"ghost"}
													asChild
												>
													<Link
														href={href}
														className="flex items-center"
													>
														<Icon />
														{label}
													</Link>
												</Button>
											</DropdownMenuItem>
										);
									})}
									<DropdownMenuItem asChild>
										<SignOutButton>
											<Button
												type="button"
												className="w-full"
												variant={"destructive"}
											>
												Logout
											</Button>
										</SignOutButton>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</li>
					</ul>
				</nav>

				{/* Small Screen Nav Items */}
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger className="block lg:hidden">
						<MenuIcon />
					</SheetTrigger>
					<SheetContent className="w-full bg-foreground text-background">
						<SheetHeader>
							<SheetTitle className="text-background">
								SoulePsycle.com
							</SheetTitle>
							<SheetDescription>{""}</SheetDescription>
						</SheetHeader>

						<nav className="py-6">
							<ul className="flex flex-col items-end gap-12">
								<li>
									<DropdownMenu>
										<DropdownMenuTrigger>
											<Avatar>
												<AvatarImage
													src={userAvatarImg}
												/>
												<AvatarFallback>
													CN
												</AvatarFallback>
											</Avatar>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuLabel>
												My Account
											</DropdownMenuLabel>
											<DropdownMenuSeparator />
											{AVATAR_LINKS.map((link) => {
												const {
													href,
													icon: Icon,
													label,
												} = link;

												return (
													<DropdownMenuItem
														key={href}
														asChild
													>
														<Button
															type="button"
															className="w-full justify-start cursor-pointer"
															variant={"ghost"}
															onClick={() =>
																setOpen(!open)
															}
															asChild
														>
															<Link
																href={href}
																className="flex items-center"
															>
																<Icon />
																{label}
															</Link>
														</Button>
													</DropdownMenuItem>
												);
											})}
										</DropdownMenuContent>
									</DropdownMenu>
								</li>
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
			</div>
		</header>
	);
};

export default RootNav;
