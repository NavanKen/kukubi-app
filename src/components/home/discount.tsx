"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, Users } from "lucide-react";
import KukubiCTA from "./ui/cta";

const discountOffers = [
  {
    id: 1,
    title: "Promo Paket Keluarga",
    description: "Beli 4 porsi Siomay Ayam Udang, gratis 1 porsi + teh manis",
    originalPrice: 125000,
    discountPrice: 100000,
    discount: "20%",
    validUntil: "31 Agustus 2025",
    image: "/api/placeholder/400/250",
    popular: true,
    minOrder: 4,
  },
  {
    id: 2,
    title: "Diskon Hari Senin",
    description: "Setiap hari Senin diskon 15% untuk semua menu dimsum",
    originalPrice: 25000,
    discountPrice: 21250,
    discount: "15%",
    validUntil: "Setiap Senin",
    image: "/api/placeholder/400/250",
    popular: false,
    minOrder: 2,
  },
  {
    id: 3,
    title: "Promo Buka Puasa",
    description:
      "Paket buka puasa hemat untuk 6-8 orang dengan berbagai varian dimsum",
    originalPrice: 180000,
    discountPrice: 150000,
    discount: "17%",
    validUntil: "Selama Ramadan",
    image: "/api/placeholder/400/250",
    popular: true,
    minOrder: 1,
  },
  {
    id: 4,
    title: "Diskon Mahasiswa",
    description: "Khusus mahasiswa, tunjukkan KTM dan dapatkan diskon spesial",
    originalPrice: 25000,
    discountPrice: 20000,
    discount: "20%",
    validUntil: "Setiap hari",
    image: "/api/placeholder/400/250",
    popular: false,
    minOrder: 1,
  },
  {
    id: 5,
    title: "Promo Weekend",
    description: "Weekend spesial! Beli 3 gratis 1 untuk semua varian siomay",
    originalPrice: 75000,
    discountPrice: 50000,
    discount: "33%",
    validUntil: "Sabtu & Minggu",
    image: "/api/placeholder/400/250",
    popular: true,
    minOrder: 3,
  },
];

const Discount = () => {
  return (
    <>
      <div className="relative px-7 py-24 md:px-20 md:py-24 min-h-screen bg-white">
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

        <div className="text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Promo & <span className="text-orange-500">Diskon Spesial</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Nikmati berbagai penawaran menarik untuk dimsum autentik favorit
              Anda. Jangan sampai terlewat kesempatan emas ini!
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pb-10">
          <Carousel className="w-full bg-transparent">
            <CarouselContent className="-ml-2 md:-ml-4">
              {discountOffers.map((offer) => (
                <CarouselItem
                  key={offer.id}
                  className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="h-full border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="relative h-48 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                          <div className="text-6xl">🥟</div>
                        </div>

                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge
                            variant="destructive"
                            className="bg-red-500 text-white font-semibold"
                          >
                            -{offer.discount}
                          </Badge>
                          {offer.popular && (
                            <Badge className="bg-orange-500 text-white">
                              Popular
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                          {offer.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {offer.description}
                        </p>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-orange-500">
                            Rp {offer.discountPrice.toLocaleString("id-ID")}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            Rp {offer.originalPrice.toLocaleString("id-ID")}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{offer.validUntil}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>Min. {offer.minOrder} porsi</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            4.8 (125 Ulasan)
                          </span>
                        </div>
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3">
                          Pesan Sekarang
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
        <KukubiCTA />
      </div>
    </>
  );
};

export default Discount;
