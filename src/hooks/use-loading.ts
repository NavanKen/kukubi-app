import { useState, useCallback } from "react";

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const withLoading = useCallback(async (callback: () => Promise<void>) => {
    try {
      setIsLoading(true);
      await callback();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, withLoading };
};
