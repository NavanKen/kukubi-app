import KukubiCTA from "./ui/cta";

const Discount = () => {
  return (
    <>
      <div className="relative px-7 py-24 md:px-20 md:py-24 max-h-fit bg-white">
        <div className="hidden md:block absolute top-0 left-0 w-32 h-32 border-4 border-orange-600 opacity-80 border-t-0 border-r-0 rounded-bl-full"></div>
        <div className="block md:hidden absolute top-10 left-7 w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
        <div className="absolute bottom-12 left-11 grid grid-cols-8 gap-2 opacity-10">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 opacity-70 rounded-full"
            />
          ))}
        </div>
        <div className="absolute top-20 right-5 w-[5px] h-24 bg-orange-600"></div>

        <KukubiCTA />
      </div>
    </>
  );
};

export default Discount;
