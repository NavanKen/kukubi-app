import ProductDetail from "@/components/member/product/product-detail";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

const ProductDetailPage = ({ params }: ProductDetailPageProps) => {
  return <ProductDetail productId={params.id} />;
};

export default ProductDetailPage;
