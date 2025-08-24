"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOutIcon, ChevronRight } from "lucide-react";
import { useState } from "react";

const DashboardNavbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <div className="bg-gradient-to-br from-orange-500 to-red-500 h-screen w-full max-w-[67px] py-6 px-2 flex justify-between items-center flex-col">
        <Avatar className="h-10 w-10 border-1 border-white">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="space-y-8">
          <button onClick={() => setOpen(!open)}>
            <ChevronRight
              className={`w-10 h-10 text-white transition-transform duration-300 ${
                open ? "-rotate-180" : "rotate-0"
              }`}
            />
          </button>
          <LogOutIcon className="text-white h-10 w-10" />
        </div>
      </div>
    </>
  );
};

export default DashboardNavbar;
