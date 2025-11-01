"use client";

import ProductDetail from "@/components/member/product/product-detail";
import { useParams } from "next/navigation";

const ProductDetailPage = () => {
  const { productId } = useParams();
  return <ProductDetail productId={productId as string} />;
};

export default ProductDetailPage;
