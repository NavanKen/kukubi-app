import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default AppLayout;
