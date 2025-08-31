import { useCallback, useEffect, useState } from "react";
import { getUserPaginate, subscribeUser } from "@/service/user";
import { IUserAdmin } from "@/types/user.types";

export const useUsers = (search: string, limit: number, page: number) => {
  const [menuData, setMenuData] = useState<IUserAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const offset = (page - 1) * limit;
    const res = await getUserPaginate({ search, limit, offset });

    if (res.status && res.data) {
      setMenuData(res.data);
      setTotal(res.count ?? 0);
    }

    setIsLoading(false);
  }, [search, limit, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const unsub = subscribeUser((payload) => {
      switch (payload.eventType) {
        case "INSERT": {
          const newData = payload.new as IUserAdmin;

          if (newData.name.toLowerCase().includes(search.toLowerCase())) {
            const offset = (page - 1) * limit;
            if (offset === 0) {
              setMenuData((prev) => [newData, ...prev].slice(0, limit));
              setTotal((prev) => prev + 1);
            } else {
              setTotal((prev) => prev + 1);
            }
          }
          break;
        }

        case "UPDATE": {
          const updated = payload.new as IUserAdmin;
          setMenuData((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
          break;
        }

        case "DELETE": {
          const deleted = payload.old as IUserAdmin;
          setMenuData((prev) => prev.filter((item) => item.id !== deleted.id));
          setTotal((prev) => Math.max(prev - 1, 0));
          break;
        }
      }
    });

    return () => unsub();
  }, [search, limit, page]);

  return { menuData, isLoading, total, refetch: fetchData };
};
