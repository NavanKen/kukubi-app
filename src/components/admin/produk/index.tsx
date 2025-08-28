import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import MenuData from "./menu-data";
import CreateDialog from "./dialog/create-dialog";
import { ThemeAwareButton } from "../ui/theme-button";

const Produk = () => {
  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Produk Manajamen</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
              <Input type="text" placeholder="Search" className="py-5 px-9" />
            </div>
            <CreateDialog />
          </div>
        </div>
        <div className="mt-10">
          <MenuData />
        </div>
      </div>
    </>
  );
};

export default Produk;
