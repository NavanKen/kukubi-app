"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

const ProductCards = ({
  onAddToCart,
}: {
  onAddToCart: (product: any) => void;
}) => {
  const products = [
    {
      id: 1,
      name: "Latte",
      description: "Espresso with steamed milk and a thin layer of foam.",
      price: 35000,
      image: "/placeholder-pse5x.png",
    },
    {
      id: 2,
      name: "Grilled Salmon",
      description: "Pan-seared salmon fillet with roasted vegetables.",
      price: 95000,
      image: "/placeholder-adb6b.png",
    },
    {
      id: 3,
      name: "New York Cheesecake",
      description: "Creamy classic cheesecake with berry compote.",
      price: 40000,
      image: "/placeholder-23fp4.png",
    },
    {
      id: 4,
      name: "Dimsum Ayam",
      description: "Traditional steamed chicken dumplings.",
      price: 12000,
      image: "/placeholder-a6nji.png",
    },
    {
      id: 5,
      name: "Cappuccino",
      description: "Espresso with steamed milk foam and cocoa powder.",
      price: 32000,
      image: "/placeholder-3tvbm.png",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="relative h-48 w-full">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {product.description}
            </p>
            <p className="text-xl font-bold">
              Rp {product.price.toLocaleString()}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              onClick={() => onAddToCart(product)}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductCards;
