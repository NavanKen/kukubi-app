import { useEffect, useState } from "react";
import { IProduk } from "@/types/produk.type";
import { getProduk, subscribeProduk } from "@/service/produk";

export const useProdukRealtime = () => {
  const [menuData, setMenuData] = useState<IProduk[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    const res = await getProduk();

    if (res.status && res.data) {
      setMenuData(res.data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getData();

    const unsub = subscribeProduk((payload) => {
      switch (payload.eventType) {
        case "INSERT":
          setMenuData((prev) => [payload.new as IProduk, ...prev]);
          break;

        case "UPDATE":
          setMenuData((prev) => {
            const updated = prev.filter((item) => item.id !== payload.new?.id);
            return [payload.new as IProduk, ...updated];
          });
          break;

        case "DELETE":
          setMenuData((prev) =>
            prev.filter((item) => item.id !== payload.old?.id)
          );
          break;
      }
    });

    return () => unsub();
  }, []);

  return { menuData, isLoading };
};
