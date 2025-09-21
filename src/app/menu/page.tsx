import Navbar from "@/components/ui/navbar";
import Menu from "@/components/menu";
import Footer from "@/components/ui/footer";

const MenuPages = () => {
  return (
    <>
      <Navbar />
      <div className="px-7 py-24 min-h-screen md:px-20 w-full">
        <div className="text-center mb-5">
          <h1 className="text-gray-800 font-bold text-3xl mb-3">
            Menu Dim<span className="text-orange-600">sum Kami</span>
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto">
            Pilihan dimsum autentik yang dibuat fresh setiap hari dengan resep
            turun temurun dan bahan-bahan pilihan terbaik
          </p>
        </div>
        <Menu />
      </div>
      <Footer />
    </>
  );
};

export default MenuPages;
