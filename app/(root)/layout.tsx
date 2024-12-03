import RootNav from "./components/root-nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
    <RootNav />
    <main>
      {children}
    </main>
  </>
}