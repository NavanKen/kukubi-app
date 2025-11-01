import ProductDetail from "@/components/member/product/product-detail";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const { id } = await params;
  return <ProductDetail productId={id} />;
};

export default ProductDetailPage;
