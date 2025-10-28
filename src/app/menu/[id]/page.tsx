import ProductDetailPublic from "@/components/menu/product-detail-public";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

const ProductDetailPublicPage = ({ params }: ProductDetailPageProps) => {
  return (
    <>
      <Navbar />
      <ProductDetailPublic productId={params.id} />
      <Footer />
    </>
  );
};

export default ProductDetailPublicPage;
