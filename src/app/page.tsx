import AppLayout from "@/layout/app-layout";
import Hero from "@/components/home/hero";
import Produk from "@/components/home/produk";
import WhyUs from "@/components/home/why";
import Discount from "@/components/home/discount";

const Home = () => {
  return (
    <>
      <AppLayout>
        <Hero />
        <Produk />
        <WhyUs />
        <Discount />
      </AppLayout>
    </>
  );
};

export default Home;
