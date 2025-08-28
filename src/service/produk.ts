import supabase from "@/lib/supabase/client";
import { IProduk } from "@/types/produk.type";

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

export const createProduk = async () => {};

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

export const deleteProduk = async () => {};

export const uploadImage = async (file: File, oldImage?: string) => {
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
