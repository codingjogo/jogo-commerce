"use client";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signUpSchema, TSignUp } from "@/lib/schemas/signUpSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";

const SignUpForm = () => {
	const router = useRouter();

	const form = useForm<TSignUp>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			email: "",
		},
	});

	const onSubmit: SubmitHandler<TSignUp> = async (values: TSignUp) => {
		console.log(values);

		try {
			const res = await axios.post("/api/auth/sign-up", values);

			if (res.status === 200) {
				toast.success("Sign Up Success");
				form.reset();

				setTimeout(() => {
					router.refresh();
					router.push("/");
				}, 1000);
			} else {
				toast.error("Please try again");
			}
		} catch (err) {
			console.log("SUBMIT HANDLER ERROR SIGN UP", err);
		}
	};

	return (
		<>
			<Toaster
				toastOptions={{
					duration: 900,
				}}
			/>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
				>
					<Card>
						<CardHeader>
							<CardTitle>Sign Up</CardTitle>
						</CardHeader>
						<CardContent>
							<FormField
								control={form.control}
								name="first_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input
												placeholder="John"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="last_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Doe"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="john@example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button className="w-full" type="submit">
								Sign Up
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</>
	);
};

export default SignUpForm;
