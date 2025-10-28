import { useCallback, useEffect, useState } from "react";
import { IReview } from "@/types/review.type";
import { getReviewsByProductId, subscribeReviews } from "@/service/review";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export const useReviews = (productId: number) => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!productId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const res = await getReviewsByProductId(productId);

    if (res.status && res.data) {
      setReviews(res.data);
    }

    setIsLoading(false);
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!productId) return;

    const unsub = subscribeReviews(
      productId,
      (payload: RealtimePostgresChangesPayload<IReview>) => {
        switch (payload.eventType) {
          case "INSERT": {
            fetchData();
            break;
          }

          case "UPDATE": {
            const updated = payload.new as IReview;
            setReviews((prev) =>
              prev.map((item) => (item.id === updated.id ? updated : item))
            );
            break;
          }

          case "DELETE": {
            const deleted = payload.old as IReview;
            setReviews((prev) => prev.filter((item) => item.id !== deleted.id));
            break;
          }
        }
      }
    );

    return () => {
      unsub();
    };
  }, [productId, fetchData]);

  return { reviews, isLoading, refetch: fetchData };
};
