"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";

const Navbar = () => {
  const navItems = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Menu",
      href: "/",
    },
    {
      title: "About",
      href: "/",
    },
    {
      title: "Contact",
      href: "/",
    },
  ];

  const navIcon = [
    {
      icon: ShoppingCart,
    },
    {
      icon: User,
    },
  ];

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-md shadow-lg fixed w-full top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="md:px-20 px-7">
        <div className="flex justify-between items-center h-16">
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Wu Dimsum
          </span>

          <motion.div
            className="md:flex md:space-x-8 text-gray-700 hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {navItems.map((nav, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.4 + index * 0.1,
                }}
                whileHover={{
                  scale: 1.1,
                  y: -2,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  className="hover:text-orange-600 transition-colors duration-200 relative group"
                  href={nav.href}
                >
                  {nav.title}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-600 to-red-600 group-hover:w-full transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="flex space-x-6 items-center text-gray-700"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {navIcon.map((item, index) => (
              <motion.button
                className="cursor-pointer hover:text-orange-600 transition-all duration-200 ease-in-out relative"
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.6 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{
                  scale: 1.2,
                  rotate: 5,
                }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-orange-100 opacity-0 -z-10"
                  whileHover={{
                    opacity: 1,
                    scale: 1.5,
                  }}
                  transition={{ duration: 0.2 }}
                />
                <item.icon size={20} />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
