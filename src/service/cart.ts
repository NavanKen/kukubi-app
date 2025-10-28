import supabase from "@/lib/supabase/client";
import { ICart, ICreateCart } from "@/types/cart.type";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

// export const subscribeCart = (
//   userId: string,
//   callback: (payload: RealtimePostgresChangesPayload<ICart>) => void
// ) => {
//   const channel = supabase
//     .channel(`cart-${userId}`)
//     .on<ICart>(
//       "postgres_changes",
//       {
//         event: "*",
//         schema: "public",
//         table: "carts",
//       },
//       (payload) => {
//         callback(payload);
//       }
//     )
//     .subscribe();

//   return () => {
//     supabase.removeChannel(channel);
//   };
// };
export const subscribeCart = (
  callback: (payload: RealtimePostgresChangesPayload<ICart>) => void
) => {
  const channel = supabase
    .channel("carts-changes")
    .on<ICart>(
      "postgres_changes",
      { event: "*", schema: "public", table: "carts" },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const getCartByUserId = async (
  userId: string
): Promise<{ status: boolean; pesan?: string; data?: ICart[] }> => {
  const { data, error } = await supabase
    .from("carts")
    .select(
      `
      *,
      products (
        id,
        name,
        price,
        image,
        stock
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    return {
      status: false,
      pesan: error?.message,
    };
  }

  return {
    status: true,
    data: data as ICart[],
  };
};

export const addToCart = async (
  payload: ICreateCart
): Promise<{ status: boolean; pesan?: string }> => {
  // Check if item already exists in cart
  const { data: existingCart } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", payload.user_id)
    .eq("product_id", payload.product_id)
    .single();

  if (existingCart) {
    // Update quantity if item exists
    const { error } = await supabase
      .from("carts")
      .update({ quantity: existingCart.quantity + payload.quantity })
      .eq("id", existingCart.id);

    if (error) {
      return {
        status: false,
        pesan: error?.message || "Gagal menambahkan ke keranjang",
      };
    }

    return {
      status: true,
      pesan: "Berhasil menambahkan ke keranjang",
    };
  }

  // Insert new item
  const { error } = await supabase.from("carts").insert(payload);

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Gagal menambahkan ke keranjang",
    };
  }

  return {
    status: true,
    pesan: "Berhasil menambahkan ke keranjang",
  };
};

export const updateCartQuantity = async (
  cartId: number,
  quantity: number
): Promise<{ status: boolean; pesan?: string }> => {
  const { error } = await supabase
    .from("carts")
    .update({ quantity })
    .eq("id", cartId);

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Gagal update quantity",
    };
  }

  return {
    status: true,
    pesan: "Quantity berhasil diupdate",
  };
};

export const removeFromCart = async (
  cartId: number
): Promise<{ status: boolean; pesan?: string }> => {
  const { error } = await supabase.from("carts").delete().eq("id", cartId);

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Gagal menghapus item",
    };
  }

  return {
    status: true,
    pesan: "Item berhasil dihapus",
  };
};

export const clearCart = async (
  userId: string
): Promise<{ status: boolean; pesan?: string }> => {
  const { error } = await supabase.from("carts").delete().eq("user_id", userId);

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Gagal mengosongkan keranjang",
    };
  }

  return {
    status: true,
    pesan: "Keranjang berhasil dikosongkan",
  };
};
