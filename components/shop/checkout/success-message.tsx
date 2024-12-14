"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SuccessMessage = () => {
  const router = useRouter();
	useEffect(() => {
		const timer = setTimeout(() => {
			// Redirect to the shop page after 10 seconds
			window.location.href = "/shop";
      router.refresh();
		}, 10000);

		// Cleanup the timer on unmount
		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="h-screen flex items-center justify-center">
			<Card className="shadow-xl">
				<CardContent className="p-6 flex flex-col items-center justify-center">
					<h1>Your order was placed successfully!</h1>
					<p className="mb-4">
						You will be redirected to the shop shortly, or you may
						go back to the shop now!
					</p>
					<Button type="button" asChild>
						<Link href={"/shop"}>Go Shop!</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default SuccessMessage;
