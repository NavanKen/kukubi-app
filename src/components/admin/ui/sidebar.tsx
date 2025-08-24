"use client";
import { cn } from "@/lib/utils";

const DashboardSidebar = () => {
  return (
    <>
      <div
        className={cn(
          "fixed z-50 flex h-screen w-full max-w-[230px] -translate-x-full flex-col justify-between bg-white py-6 transition-all lg:relative lg:translate-x-0"
          //   { "translate-x-0": IsOpen }
        )}
      >
        <div>
          <div className="flex justify-center border-b-1 border-default-200">
            <h1 className="text-3xl font-bold text-orange-600 mb-5">Kukubi</h1>
          </div>
        </div>
        <div className="px-4"></div>
      </div>
    </>
  );
};

export default DashboardSidebar;
