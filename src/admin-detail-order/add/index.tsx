"use client";

import { useState } from "react";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductCards from "./ui/product-cards";
import Cart from "./ui/cart";

const AddOrder = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddToCart = (product: any) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div>
      <div className="flex md:flex-row flex-col md:items-center gap-3 justify-between mb-5">
        <h1 className="text-3xl font-bold">Menu</h1>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          <Input
            type="text"
            placeholder="Search..."
            className="py-5 px-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-6 justify-between">
        <div className="flex-1">
          <ProductCards onAddToCart={handleAddToCart} />
        </div>
        <div className="md:w-80">
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </div>
    </div>
  );
};

export default AddOrder;
