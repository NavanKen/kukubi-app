"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Home,
  LayoutGrid,
  Info,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProfileUser } from "@/service/auth";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import CartModal from "../member/menu/cart-modal";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const router = useRouter();
  const { cartData, total: cartTotal, refetch: refetchCart } = useCart(userId);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const res = await getProfileUser();
    if (res.status && res.data) {
      setIsLoggedIn(true);
      setUserRole(res.data.profile.role ?? "");
      setUserId(res.data.auth.id);
      setUserAvatar(res.data.profile.avatar);
    }
  };

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }

    if (userRole === "admin") {
      router.push("/admin");
    } else {
      router.push("/member");
    }
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    setIsCartOpen(true);
  };

  const navItems = [
    {
      title: "Beranda",
      href: "/",
      icon: Home,
    },
    {
      title: "Menu",
      href: "/menu",
      icon: LayoutGrid,
    },
    {
      title: "Tentang Kami",
      href: "/about",
      icon: Info,
    },
    {
      title: "Kontak",
      href: "/contact",
      icon: MessageCircle,
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <motion.div
        className={`bg-white fixed w-full top-0 z-50 duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100"
            : ""
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="md:px-20 px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <motion.button
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                onClick={toggleMobileMenu}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {isMobileMenuOpen ? (
                    <X size={24} className="text-gray-700" />
                  ) : (
                    <Menu size={24} className="text-gray-700" />
                  )}
                </motion.div>
              </motion.button>

              <motion.span
                className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
                transition={{ type: "spring", stiffness: 300 }}
              >
                Kukubi
              </motion.span>
            </div>

            <div className="hidden md:flex md:space-x-8 text-gray-700">
              {navItems.slice(0, 4).map((nav, index) => (
                <motion.div key={index} className="relative group">
                  <Link
                    className="hover:text-orange-600 transition-colors duration-200 py-2 px-1 relative"
                    href={nav.href}
                  >
                    {nav.title}
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="flex space-x-4 items-center text-gray-700"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.button
                className="p-2 hover:bg-gray-100 rounded-lg hover:text-orange-600 transition-all duration-200 ease-in-out relative group"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCartClick}
                title="Cart"
              >
                <ShoppingCart size={20} />
                {isLoggedIn && cartData.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartData.length}
                  </span>
                )}
                <motion.div
                  className="absolute -inset-1 rounded-lg bg-orange-100 opacity-0 -z-10"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>

              <motion.button
                className="p-2 hover:bg-gray-100 rounded-lg hover:text-orange-600 transition-all duration-200 ease-in-out relative group"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProfileClick}
                title="Profile"
              >
                {isLoggedIn && userAvatar ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={userAvatar}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <User size={20} />
                )}
                <motion.div
                  className="absolute -inset-1 rounded-lg bg-orange-100 opacity-0 -z-10"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMobileMenu}
            />

            <motion.div
              className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                  <motion.span
                    className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Kukubi
                  </motion.span>
                  <motion.button
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    onClick={toggleMobileMenu}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {isMobileMenuOpen ? (
                        <X size={24} className="text-gray-700" />
                      ) : (
                        <Menu size={24} className="text-gray-700" />
                      )}
                    </motion.div>
                  </motion.button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((nav, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * (index + 1), duration: 0.3 }}
                    >
                      <Link
                        href={nav.href}
                        className={`flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group`}
                        onClick={toggleMobileMenu}
                      >
                        <motion.div
                          className={`p-2 rounded-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <nav.icon size={20} />
                        </motion.div>
                        <span className="font-medium">{nav.title}</span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartData={cartData}
        cartTotal={cartTotal}
        userId={userId}
        refetchCart={refetchCart}
      />
    </>
  );
};

export default Navbar;
