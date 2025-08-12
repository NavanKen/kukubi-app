import Navbar from "@/components/home/navbar";
import Hero from "@/components/home/hero";
import Produk from "@/components/home/produk";
import About from "@/components/home/about";

const Home = () => {
  return (
    <>
      <div>
        <Navbar />
        <Hero />
        <Produk />
        <About />
      </div>
    </>
  );
};

export default Home;
