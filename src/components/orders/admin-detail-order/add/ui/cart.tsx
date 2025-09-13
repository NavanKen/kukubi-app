"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { ICartItem } from "@/types/order_items.type";

interface CartProps {
  cartItems: ICartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onOrder: () => void;
  isOrdering: boolean;
}

const Cart = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOrder,
  isOrdering,
}: CartProps) => {
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Keranjang</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Keranjang kosong
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between space-x-2"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Rp {item.product.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() =>
                      onUpdateQuantity(
                        item.product.id!,
                        Math.max(0, item.quantity - 1)
                      )
                    }
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() =>
                      onUpdateQuantity(item.product.id!, item.quantity + 1)
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => onRemoveItem(item.product.id!)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Total</CardTitle>
              <CardTitle className="text-xl">
                Rp {total.toLocaleString()}
              </CardTitle>
            </div>
          </div>
        )}
      </CardContent>

      {cartItems.length > 0 && (
        <CardFooter className="flex-col gap-2">
          <Button type="button" variant="secondary" className="w-full">
            Batal
          </Button>
          <Button
            type="button"
            className="w-full"
            onClick={onOrder}
            disabled={isOrdering}
          >
            {isOrdering ? "Processing..." : "Order"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default Cart;
