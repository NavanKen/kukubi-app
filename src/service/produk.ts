import environment from "@/config/environment";
import supabase from "@/lib/supabase/client";
import { ICreateProduk, IProduk } from "@/types/produk.type";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export const subscribeProduk = (
  callback: (payload: RealtimePostgresChangesPayload<ICreateProduk>) => void
) => {
  const channel = supabase
    .channel("produk-changes")
    .on<ICreateProduk>(
      "postgres_changes",
      { event: "*", schema: "public", table: "products" },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const getProdukPaginate = async ({
  search = "",
  limit = 10,
  offset = 0,
}: {
  search?: string;
  limit?: number;
  offset?: number;
}) => {
  const query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .ilike("name", `%${search}%`)
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return { status: false, error };
  }

  return { status: true, data, count };
};

// Gak digae gara gara ws onok getProdukPaginate()
export const getProduk = async (): Promise<{
  status: boolean;
  pesan?: string;
  data?: IProduk[];
}> => {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price, stock, image");

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Terjadi Kesalahan",
    };
  }
  return {
    status: true,
    data: data as IProduk[],
  };
};

export const getProdukById = async (
  productId: string
): Promise<{
  status: boolean;
  pesan?: string;
  data?: IProduk;
}> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) {
    return {
      status: false,
      pesan: error.message,
    };
  }

  return {
    status: true,
    pesan: "Berhasil mendapatkan Data Produk",
    data,
  };
};

export const createProduk = async (
  payload: ICreateProduk
): Promise<{ status: boolean; pesan?: string }> => {
  const { name, description, price, stock, file } = payload;

  const image = await uploadFile(file!);

  if (!image) {
    return { status: false, pesan: "Gagal upload File" };
  }

  const { error } = await supabase
    .from("products")
    .insert({ name, description, price, stock, image });

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Gagal update data",
    };
  }

  return {
    status: true,
    pesan: "Data berhasil ditambahkan",
  };
};

export const editProduk = async (
  payload: IProduk
): Promise<{ status: boolean; pesan?: string }> => {
  const { name, description, price, stock, image, id } = payload;

  const { error } = await supabase
    .from("products")
    .update({ name, description, price, stock, image })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Terjadi Kesalahan",
    };
  }
  return {
    status: true,
    pesan: "Data Berhasil Di Update",
  };
};

export const deleteProduk = async (
  id: number
): Promise<{ status: boolean; pesan?: string }> => {
  const { data: imageData } = await supabase
    .from("products")
    .select("image")
    .eq("id", id)
    .single();

  const img = imageData?.image;
  const supabaseUrl = environment.SUPABASE_URL;

  const oldImage = img.replace(
    `${supabaseUrl}/storage/v1/object/public/kukubi-buckets/`,
    ""
  );

  await supabase.storage.from("kukubi-buckets").remove([oldImage]);
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return {
      status: false,
      pesan: error?.message || "Terjadi Kesalahan",
    };
  }

  return {
    status: true,
    pesan: "Data berhasil dihapus",
  };
};

export const updateProductStock = async (
  productId: number,
  quantityChange: number
): Promise<{ status: boolean; pesan?: string }> => {
  // Get current stock
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", productId)
    .single();

  if (fetchError) {
    return {
      status: false,
      pesan: fetchError?.message || "Gagal mengambil data produk",
    };
  }

  const newStock = product.stock + quantityChange;

  if (newStock < 0) {
    return {
      status: false,
      pesan: "Stock tidak mencukupi",
    };
  }

  // Update stock
  const { error: updateError } = await supabase
    .from("products")
    .update({ stock: newStock })
    .eq("id", productId);

  if (updateError) {
    return {
      status: false,
      pesan: updateError?.message || "Gagal update stock",
    };
  }

  return {
    status: true,
    pesan: "Stock berhasil diupdate",
  };
};

export const uploadFile = async (file: File, oldImage?: string) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `images/produk/${fileName}`;

  if (oldImage) {
    const oldPath = oldImage.replace(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kukubi-buckets/`,
      ""
    );
    await supabase.storage.from("kukubi-buckets").remove([oldPath]);
  }

  const { error } = await supabase.storage
    .from("kukubi-buckets")
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("kukubi-buckets").getPublicUrl(filePath);

  return publicUrl;
};
