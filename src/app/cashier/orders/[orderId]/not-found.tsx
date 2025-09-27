import { Card, CardContent } from "@/components/ui/card";
import { SearchX } from "lucide-react";

const NotFoundOrder = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Order Tidak Ditemukan</h3>
          <p className="text-muted-foreground">
            Maaf, order yang Anda cari tidak dapat ditemukan. Silakan periksa
            kembali detail order atau coba lagi.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundOrder;
