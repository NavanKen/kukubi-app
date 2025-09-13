"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import type { IProduk } from "@/types/produk.type";

interface ProductCardsProps {
  products: IProduk[];
  onAddToCart: (product: IProduk) => void;
  isLoading: boolean;
}

const ProductCards = ({
  products,
  onAddToCart,
  isLoading,
}: ProductCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden animate-pulse p-0">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 my-2 w-full" />
              <Skeleton className="h-4 my-2 w-full" />
              <Skeleton className="h-6 my-2 w-full" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Skeleton className="h-10 my-2 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Tidak ada produk yang ditemukan</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden p-0">
          <div className="relative h-48 w-full">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {product.description}
            </p>
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold">
                Rp {product.price.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Stock: {product.stock}
              </p>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              onClick={() => onAddToCart(product)}
              className="w-full"
              size="sm"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stock === 0 ? "Stock Habis" : "Tambah Ke Keranjang"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductCards;
