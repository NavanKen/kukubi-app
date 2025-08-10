import Navbar from "@/components/home/navbar";
import Hero from "@/components/home/hero";

const Home = () => {
  return (
    <>
      <div className="bg-gradient-to-br from-orange-50 to-red-50">
        <Navbar />
        <Hero />
      </div>
    </>
  );
};

export default Home;
