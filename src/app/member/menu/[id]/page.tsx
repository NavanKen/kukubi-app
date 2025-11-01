"use client";

import ProductDetail from "@/components/member/product/product-detail";
import { useParams } from "next/navigation";

const ProductDetailPage = () => {
  const { id } = useParams();
  return <ProductDetail productId={id as string} />;
};

export default ProductDetailPage;
