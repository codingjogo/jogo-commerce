import FeaturedProducts from "@/components/home/featured-products";
import Hero from "@/components/home/hero";
import ProductGallery from "@/components/home/product-gallery";

export default async function Home() {

  return (
    <>
      <Hero />
      <FeaturedProducts />
      <ProductGallery />
    </>
  );
}
