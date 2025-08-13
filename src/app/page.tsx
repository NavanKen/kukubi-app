import Navbar from "@/components/home/navbar";
import Hero from "@/components/home/hero";
import Produk from "@/components/home/produk";
import About from "@/components/home/about";
import Discount from "@/components/home/discount";
import Footer from "@/components/home/footer";

const Home = () => {
  return (
    <>
      <div>
        <Navbar />
        <Hero />
        <Produk />
        <About />
        <Discount />
        <Footer />
      </div>
    </>
  );
};

export default Home;
