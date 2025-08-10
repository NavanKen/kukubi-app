"use client";
import Image from "next/image";
import { motion } from "motion/react";
import Button from "./ui/button";

const Hero = () => {
  return (
    <>
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-30"
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{
          duration: 8,
          delay: 1,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute top-40 right-32 w-16 h-16 bg-yellow-300 rounded-lg opacity-20 rotate-45"
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 45 }}
        transition={{ duration: 1.5, delay: 1.2 }}
      />
      <motion.div
        className="absolute bottom-32 left-16 w-24 h-24 bg-red-200 rounded-full opacity-25"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, delay: 0.8 }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-12 h-12 bg-orange-300 rounded-full opacity-40"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 0.4 }}
        transition={{
          duration: 2,
          delay: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-8 h-8 bg-yellow-400 rounded-lg opacity-30 rotate-12"
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 12 }}
        transition={{ duration: 1.2, delay: 2 }}
      />

      <motion.div
        className="absolute top-1/2 left-1/4 w-6 h-6 bg-orange-400 rounded-full opacity-20"
        animate={{
          y: [-10, 10, -10],
          x: [-5, 5, -5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-red-300 rounded-full opacity-25"
        animate={{
          y: [10, -10, 10],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute top-1/4 left-1/2 w-14 h-14 bg-gradient-to-br from-orange-300 to-red-300 opacity-20"
        style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 180 }}
        transition={{ duration: 2, delay: 1.8 }}
      />
      <motion.div
        className="absolute bottom-1/2 right-1/5 w-18 h-18 bg-yellow-300 opacity-15 rounded-lg"
        initial={{ scale: 0, rotate: 45 }}
        animate={{ scale: 1, rotate: 45 }}
        transition={{ duration: 1.5, delay: 2.2 }}
      />

      <div className="flex items-center md:justify-between md:flex-row flex-col-reverse px-7 py-24 min-h-screen md:px-20 md:py-20 relative overflow-hidden">
        <motion.div
          className="flex flex-col gap-2 relative z-10 mt-10 md:mt-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="md:text-6xl text-3xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Dimsum Autentik{" "}
            <motion.span
              className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Langsung Dari Dapur
            </motion.span>
          </motion.h1>

          <motion.p
            className="md:text-xl text- text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Nikmati kelezatan dimsum autentik dengan cita rasa yang tak
            terlupakan. Dibuat dengan bahan-bahan pilihan dan resep turun
            temurun.
          </motion.p>

          <motion.div
            className="flex md:flex-row flex-col md:space-x-4 w-full gap-3 md:gap-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                variant="custom"
                className="bg-gradient-to-r w-full from-orange-500 to-red-500 md:px-8 md:py-4 px-4 py-2 text-lg text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                Pesan Sekarang
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                variant="custom"
                className="border-2 border-orange-500 md:px-8 md:py-4 px-4 py-2 text-orange-600 hover:bg-orange-50 w-full transition-colors duration-300"
              >
                Lihat Menu
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative w-full md:max-w-lg max-w-md md:h-96 h-72 z-10"
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="absolute -bottom-4 -right-4 w-full h-full bg-yellow-300 rounded-2xl opacity-20"
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 0.2, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <motion.div
            className="absolute -bottom-2 -right-2 w-full h-full bg-orange-300 rounded-2xl opacity-30"
            initial={{ opacity: 0, x: 10, y: 10 }}
            animate={{ opacity: 0.3, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          />

          <motion.div
            className="absolute -bottom-2 -left-2 md:-left-7  bg-white rounded-lg py-2 px-4 z-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Fresh Daily</p>
                <p className="text-gray-500 text-sm">Dibuat setiap hari</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative w-full h-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Image
              src={"/images/hero.jpg"}
              alt="dimsum-image"
              fill
              priority
              className="object-cover rounded-2xl shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Hero;
