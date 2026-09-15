"use client";

import React, { useState } from "react";
import { WebData } from "@/types/content";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ChakraStrip } from "@/components/ChakraStrip";
import { AboutSection } from "@/components/AboutSection";
import { TherapiesSection } from "@/components/TherapiesSection";
import { WorkshopsSection } from "@/components/WorkshopsSection";
import { HarmonizationSection } from "@/components/HarmonizationSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { BookingSection } from "@/components/BookingSection";
import { LocationSection } from "@/components/LocationSection";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/BookingModal";
import Image from "next/image";

interface MainPageClientProps {
  data: WebData;
}

export const MainPageClient: React.FC<MainPageClientProps> = ({ data }) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  const handleOpenBooking = (serviceName?: string) => {
    setPreselectedService(serviceName);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setPreselectedService(undefined);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fbf9f5]">
      {/* Cañas de bambú zen ambientales fijas en los bordes de la pantalla (visibles en toda la navegación) */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-32 xl:w-44 pointer-events-none z-0 opacity-15 xl:opacity-20 overflow-hidden select-none">
        <Image
          src="/brand/bamboo-left.webp"
          alt=""
          fill
          className="object-cover object-left"
          priority
        />
      </div>
      <div className="hidden lg:block fixed inset-y-0 right-0 w-32 xl:w-44 pointer-events-none z-0 opacity-15 xl:opacity-20 overflow-hidden select-none">
        <Image
          src="/brand/bamboo-right.webp"
          alt=""
          fill
          className="object-cover object-right"
          priority
        />
      </div>

      {/* Barra de navegación */}
      <Navbar config={data.config} onOpenBooking={handleOpenBooking} />

      {/* Contenido Principal */}
      <main className="flex-1 relative z-10">
        <Hero config={data.config} onOpenBooking={() => handleOpenBooking()} />
        <ChakraStrip chakras={data.chakras} />
        <AboutSection config={data.config} onOpenBooking={() => handleOpenBooking()} />
        <TherapiesSection therapies={data.therapies} onOpenBooking={handleOpenBooking} />
        <WorkshopsSection workshops={data.workshops} config={data.config} />
        <HarmonizationSection items={data.harmonization} config={data.config} />
        <ReviewsSection reviews={data.reviews} config={data.config} />
        <BookingSection config={data.config} onOpenBooking={() => handleOpenBooking()} />
        <LocationSection config={data.config} />
      </main>

      {/* Pie de página */}
      <Footer config={data.config} />

      {/* Modal interactivo de reservas */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        config={data.config}
        therapies={data.therapies}
        preselectedService={preselectedService}
      />
    </div>
  );
};
