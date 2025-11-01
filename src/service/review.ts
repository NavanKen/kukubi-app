import supabase from "@/lib/supabase/client";
import { ICreateReview, IReview } from "@/types/review.type";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export const getReviewsByProductId = async (productId: number) => {
  try {
    const { data, error } = await supabase
      .from("product_reviews")
      .select(
        `
        *,
        users (
          id,
          name,
          avatar
        )
      `
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        status: false,
        pesan: error.message,
        data: null,
      };
    }

    return {
      status: true,
      pesan: "Berhasil mengambil data review",
      data: data as IReview[],
    };
  } catch (error) {
    return {
      status: false,
      pesan: "Terjadi kesalahan",
      error: error,
      data: null,
    };
  }
};

export const createReview = async (review: ICreateReview) => {
  try {
    const { data, error } = await supabase
      .from("product_reviews")
      .insert(review)
      .select()
      .single();

    if (error) {
      return {
        status: false,
        pesan: error.message,
        data: null,
      };
    }

    return {
      status: true,
      pesan: "Review berhasil ditambahkan",
      data: data,
    };
  } catch (error) {
    return {
      status: false,
      pesan: "Terjadi kesalahan",
      error: error,
      data: null,
    };
  }
};

export const updateReview = async (
  reviewId: number,
  review: string,
  rating: number
) => {
  try {
    const { data, error } = await supabase
      .from("product_reviews")
      .update({ review, rating, updated_at: new Date() })
      .eq("id", reviewId)
      .select()
      .single();

    if (error) {
      return {
        status: false,
        pesan: error.message,
        data: null,
      };
    }

    return {
      status: true,
      pesan: "Review berhasil diupdate",
      data: data,
    };
  } catch (error) {
    return {
      status: false,
      pesan: "Terjadi kesalahan",
      error: error,
      data: null,
    };
  }
};

export const deleteReview = async (reviewId: number) => {
  try {
    const { error } = await supabase
      .from("product_reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      return {
        status: false,
        pesan: error.message,
      };
    }

    return {
      status: true,
      pesan: "Review berhasil dihapus",
    };
  } catch (error) {
    return {
      status: false,
      error: error,
      pesan: "Terjadi kesalahan",
    };
  }
};

export const subscribeReviews = (
  productId: number,
  callback: (payload: RealtimePostgresChangesPayload<IReview>) => void
) => {
  const channel = supabase
    .channel(`reviews-${productId}`)
    .on<IReview>(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "product_reviews",
        filter: `product_id=eq.${productId}`,
      },
      callback
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};

export const getAverageRating = async (productId: number) => {
  try {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("rating")
      .eq("product_id", productId);

    if (error || !data || data.length === 0) {
      return {
        status: true,
        data: {
          average: 0,
          count: 0,
        },
      };
    }

    const average =
      data.reduce((sum, review) => sum + review.rating, 0) / data.length;

    return {
      status: true,
      data: {
        average: Math.round(average * 10) / 10,
        count: data.length,
      },
    };
  } catch (error) {
    return {
      status: false,
      error: error,
      data: {
        average: 0,
        count: 0,
      },
    };
  }
};
