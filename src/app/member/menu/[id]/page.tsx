import ProductDetail from "@/components/member/product/product-detail";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return <ProductDetail productId={id} />;
}
