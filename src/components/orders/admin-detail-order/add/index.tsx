"use client";

interface AddOrderProps {
  orderId: string;
}

import { useEffect, useState } from "react";
import Cart from "./ui/cart";
import ProductCards from "./ui/product-cards";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProduk } from "@/hooks/use-produk";
import type { IProduk } from "@/types/produk.type";
import type {
  ICartItem,
  ICreateOrderItem,
  IOrderItem,
} from "@/types/order_items.type";
import {
  createOrderItems,
  // deleteOrderItem,
  // updateOrderItemQuantity,
} from "@/service/order-items";
import { toast } from "sonner";
import { useDetailOrder } from "@/hooks/use-detail-order";

const AddOrder = ({ orderId }: AddOrderProps) => {
  const { orderItems: initialItems } = useDetailOrder(orderId);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);

  const { menuData: products, isLoading: productLoading } = useProduk(
    searchQuery,
    50,
    1
  );

  useEffect(() => {
    setCartItems((prev) => {
      const updated = initialItems
        .filter(
          (item): item is IOrderItem & { products: IProduk } => !!item.products
        )
        .map((item) => ({
          id: item.id,
          quantity: item.quantity,
          product: item.products,
        }));

      const merged = updated.map((upd) => {
        const existing = prev.find((p) => p.product.id === upd.product.id);
        return existing ? { ...upd, quantity: existing.quantity } : upd;
      });

      return merged;
    });
  }, [initialItems]);

  const handleAddToCart = (product: IProduk) => {
    if (product.stock === 0) {
      toast.error("Out of Stock", {
        description: `${product.name} is currently out of stock`,
      });

      return;
    }

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          toast.error("Stock Limit", {
            description: `Cannot add more ${product.name}. Stock limit reached.`,
          });
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };
  // const handleUpdateQuantity = async (productId: number, quantity: number) => {
  //   // const item = cartItems.find((i) => i.product.id === productId);
  //   // if (!item) return;

  //   // if (item.id) {
  //   //   const res = await updateOrderItemQuantity(item.id, quantity);
  //   //   if (!res.status) {
  //   //     toast.error(res.pesan || "Gagal update quantity");
  //   //     return;
  //   //   }
  //   // }

  //   setCartItems((prev) =>
  //     prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
  //   );
  // };

  // const handleRemoveItem = async (productId: number) => {
  //   // const item = cartItems.find((i) => i.product.id === productId);
  //   // if (!item) return;

  //   // if (item.id) {
  //   //   const res = await deleteOrderItem(item.id);
  //   //   if (!res.status) {
  //   //     toast.error(res.pesan || "Gagal hapus item");
  //   //     return;
  //   //   }
  //   // }

  //   setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  // };

  const handleOrder = async () => {
    if (cartItems.length === 0) return;
    console.log("ditekan");

    setIsOrdering(true);
    try {
      const orderItemsData: ICreateOrderItem[] = cartItems
        .filter((item) => item.product.id !== undefined)
        .map((item) => ({
          order_id: Number(orderId),
          product_id: Number(item.product.id),
          quantity: item.quantity,
          price: item.product.price,
        }));

      const res = await createOrderItems(orderItemsData);

      if (!res.status) throw new Error(res.pesan);

      toast.success(res.pesan);
      setCartItems([]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Gagal melakukan order");
      } else if (typeof err === "string") {
        toast.error(err);
      } else {
        toast.error("Gagal melakukan order");
      }
    } finally {
      setIsOrdering(false);
    }
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(productId);
      return;
    }

    // const product = products.find((p) => p.id === productId);
    const product = products.find(
      (p) => p.id !== undefined && Number(p.id) === productId
    );

    if (product && quantity > product.stock) {
      toast.error("Stock Limit", {
        description: `Cannot add more ${product.name}. Only ${product.stock} items available.`,
      });
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id && Number(item.product.id) === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // const handleRemoveItem = (productId: number) => {
  //   setCartItems((prev) =>
  //     prev.filter((item) => item.product.id !== productId)
  //   );
  // };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => item.product.id && Number(item.product.id) !== productId
      )
    );
  };

  // const handleOrder = async () => {
  //   if (cartItems.length === 0) return;

  //   setIsOrdering(true);
  //   try {

  //     const orderItemsData: ICreateOrderItem[] = cartItems
  //       .filter((item) => item.product.id !== undefined)
  //       .map((item) => ({
  //         product_id: Number(item.product.id),
  //         quantity: item.quantity,
  //         price: item.product.price,
  //       }));

  //     const result = await createOrderItems(orderItemsData);

  //     if (result.status) {
  //       toast.success("Order Berhasil", {
  //         description: "Your order has been placed successfully!",
  //       });

  //       setCartItems([]);
  //     } else {
  //       toast.error("Order Failed", {
  //         description: result.pesan || "Failed to place order",
  //       });
  //     }
  //   } catch (error) {
  //     toast.error("Order Failed", {
  //       description: "An error occurred while placing the order",
  //     });
  //   } finally {
  //     setIsOrdering(false);
  //   }
  // };

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
          <ProductCards
            products={products}
            onAddToCart={handleAddToCart}
            isLoading={productLoading}
          />
        </div>
        <div className="md:w-80">
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onOrder={handleOrder}
            isOrdering={isOrdering}
          />
        </div>
      </div>
    </div>
  );
};

export default AddOrder;
