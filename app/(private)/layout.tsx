import AdminNav from "@/components/admin/admin-nav";

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex gap-4">
			<AdminNav />
			<main className="flex-1 bg-background overflow-y-scroll">
				{children}
			</main>
		</div>
	);
}
