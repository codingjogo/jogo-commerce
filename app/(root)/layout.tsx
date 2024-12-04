import RootNav from "@/components/home/root-nav";
import Footer from "@/components/root/footer";

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
    <Footer />
  </>
}