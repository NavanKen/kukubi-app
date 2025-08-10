import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "custom";
}

const Button: React.FC<IButton> = ({
  children,
  className,
  variant = "primary",
  ...props
}) => {
  const baseClass =
    "rounded-full font-semibold cursor-pointer transition-all hover:scale-105 duration-300 ease-in-out";

  const variants = {
    primary: "bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 px-6 py-2 text-white",
    custom: "",
  };

  return (
    <button
      className={clsx(baseClass, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
