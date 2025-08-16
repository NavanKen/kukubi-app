import Navbar from "@/components/home/navbar";
import Hero from "@/components/home/hero";
import Produk from "@/components/home/produk";
import WhyUs from "@/components/home/why";
import Discount from "@/components/home/discount";
import Footer from "@/components/home/footer";

const Home = () => {
  return (
    <>
      <div>
        <Navbar />
        <Hero />
        <Produk />
        <WhyUs />
        <Discount />
        <Footer />
      </div>
    </>
  );
};

export default Home;
