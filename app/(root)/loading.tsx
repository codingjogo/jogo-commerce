import Image from "next/image";
import Logo from '@/public/logo.jpg'

export default function Loading() {
  return (
    <section className="container h-screen flex items-center justify-center">
      <Image 
        src={Logo}
        alt="Soule-Psycle-Logo"
        width={80}
        height={80}
      />
    </section>
  );
}
