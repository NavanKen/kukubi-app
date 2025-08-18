import Navbar from "@/components/ui/navbar";
import ContactInfo from "@/components/contact/contact_info";
import Chat from "@/components/contact/chat";
import Footer from "@/components/ui/footer";

const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white px-7 py-24 md:px-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hubungi <span className="text-orange-600">Kami</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami siap membantu Anda! Pilih cara yang paling nyaman untuk
            menghubungi tim Kukubi
          </p>
        </div>
        <div className="flex gap-8 md:flex-row flex-col">
          <ContactInfo />
          <Chat />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
