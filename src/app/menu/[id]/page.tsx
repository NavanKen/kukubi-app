"use client";

import ProductDetailPublic from "@/components/menu/product-detail-public";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { useParams } from "next/navigation";

const ProductDetailPublicPage = () => {
  const { id } = useParams();
  return (
    <>
      <Navbar />
      <ProductDetailPublic productId={id as string} />
      <Footer />
    </>
  );
};

export default ProductDetailPublicPage;
