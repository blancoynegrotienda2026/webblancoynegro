"use client";

import React, { useState, useMemo } from "react";
import { SiteConfig, ShopProduct, Therapy } from "@/types/content";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/BookingModal";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ShopClientProps {
  config: SiteConfig;
  products: ShopProduct[];
  therapies: Therapy[];
}

export const ShopClient: React.FC<ShopClientProps> = ({ config, products, therapies }) => {
  const { addToCart, setIsCartOpen, totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "Todos los productos", count: products.length },
    {
      id: "aromaterapia",
      label: "Aromaterapia & Esencias",
      count: products.filter((p) => p.category === "aromaterapia").length,
    },
    {
      id: "minerales",
      label: "Minerales & Gemas",
      count: products.filter((p) => p.category === "minerales").length,
    },
    {
      id: "herramientas",
      label: "Herramientas de Masaje",
      count: products.filter((p) => p.category === "herramientas").length,
    },
    {
      id: "armonizacion",
      label: "Armonización de Espacios",
      count: products.filter((p) => p.category === "armonizacion").length,
    },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.shortDescription.toLowerCase().includes(query) ||
        product.categoryLabel.toLowerCase().includes(query) ||
        product.benefits.some((b) => b.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleAddToCart = (product: ShopProduct) => {
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1800);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fbf9f5] text-[#212924]">
      {/* Cañas de bambú zen ambientales fijas en los bordes de la pantalla */}
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
      <Navbar config={config} onOpenBooking={() => setIsBookingOpen(true)} />

      <main className="flex-1 relative z-10 pt-28 pb-20">
        {/* Cabecera / Hero de la Tienda */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <nav className="flex items-center gap-2 text-xs text-[#6e7d73] mb-4">
            <Link href="/" className="hover:text-[#3d5a4c] transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-[#3d5a4c] font-semibold">Tienda Holística</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2ecdf] border border-[#e0d8ca] text-xs font-semibold text-[#3d5a4c] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#b08d4b]" />
              <span>Autocuidado & Terapias en Casa</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#212924] leading-tight">
              El Rincón Holístico de <br className="hidden sm:inline" />
              <span className="italic text-[#3d5a4c]">Blanco y Negro</span>
            </h1>

            <p className="text-sm sm:text-base text-[#55645a] leading-relaxed max-w-2xl mx-auto">
              Aceites esenciales 100% puros, cristales sintonizados con cuencos tibetanos y herramientas de masaje seleccionadas artesanalmente por Pepi para continuar tu bienestar en el hogar.
            </p>
          </div>

          {/* Guía en 4 pasos de cómo funciona el pedido */}
          <div className="mt-10 bg-white rounded-3xl border border-[#ece4d8] p-6 sm:p-8 shadow-xs">
            <div className="text-center max-w-xl mx-auto mb-6 space-y-1">
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#212924]">
                ¿Cómo realizar tu compra en 4 pasos?
              </h2>
              <p className="text-xs text-[#55645a]">
                Proceso directo, transparente y sin necesidad de crear contraseñas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#ece4d8] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#3d5a4c] text-[#dfc89f] font-serif font-bold text-sm flex items-center justify-center">
                  1
                </div>
                <h4 className="font-serif font-semibold text-xs text-[#212924]">
                  Elige tus productos
                </h4>
                <p className="text-xs text-[#55645a] leading-relaxed">
                  Añade a tu cesta los aceites botánicos, minerales o saquitos que necesites.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#ece4d8] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#3d5a4c] text-[#dfc89f] font-serif font-bold text-sm flex items-center justify-center">
                  2
                </div>
                <h4 className="font-serif font-semibold text-xs text-[#212924]">
                  Entrega y Contacto
                </h4>
                <p className="text-xs text-[#55645a] leading-relaxed">
                  Elige <strong>recogida gratis en tienda (Boiro)</strong> o <strong>envío a domicilio</strong> con tus datos.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#ece4d8] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#3d5a4c] text-[#dfc89f] font-serif font-bold text-sm flex items-center justify-center shadow-xs">
                  3
                </div>
                <h4 className="font-serif font-semibold text-xs text-[#212924]">
                  Confirmación en Pantalla
                </h4>
                <p className="text-xs text-[#55645a] leading-relaxed">
                  Tu comanda se registra al instante y recibes en pantalla tu número de pedido oficial (ej. #BYN-8421).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#ece4d8] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#3d5a4c] text-[#dfc89f] font-serif font-bold text-sm flex items-center justify-center">
                  4
                </div>
                <h4 className="font-serif font-semibold text-xs text-[#212924]">
                  Bizum o en Tienda
                </h4>
                <p className="text-xs text-[#55645a] leading-relaxed">
                  Realiza tu Bizum indicando tu número de pedido o abónalo en efectivo/tarjeta al retirar tu paquete en Boiro.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Barra de Filtros y Búsqueda */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-6 border-b border-[#ece4d8]">
            {/* Categorías */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? "bg-[#3d5a4c] text-white shadow-sm"
                      : "bg-white border border-[#e0d8cc] text-[#4a584f] hover:bg-[#f6f2ea]"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedCategory === cat.id
                        ? "bg-white/20 text-white"
                        : "bg-[#f0ebe1] text-[#6e7d73]"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Buscador */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-[#718276] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar lavanda, cuarzo, salvia..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-2xl bg-white border border-[#cbdbd0] text-[#212924] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3d5a4c]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-[#6e7d73]">
            <span>
              Mostrando <strong className="text-[#212924]">{filteredProducts.length}</strong> de {products.length} productos
            </span>
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-[#3d5a4c] font-semibold hover:underline"
              >
                Ver todos
              </button>
            )}
          </div>
        </section>

        {/* Rejilla de Productos */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#ece4d8] p-8 max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#f4efe5] text-[#3d5a4c] mx-auto flex items-center justify-center">
                <Search className="w-6 h-6 opacity-60" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#212924]">
                No encontramos productos con ese término
              </h3>
              <p className="text-xs text-[#6e7d73]">
                Prueba a buscar con otra palabra como &ldquo;aceite&rdquo;, &ldquo;cuarzo&rdquo;, o selecciona &ldquo;Todos los productos&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#3d5a4c] hover:underline"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const isJustAdded = addedProductId === product.id;

                return (
                  <article
                    key={product.id}
                    className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#ece4d8] shadow-xs hover:shadow-md hover:border-[#cbdbd0] transition-all duration-300"
                  >
                    {/* Imagen del producto con badge */}
                    <div className="relative aspect-4/3 overflow-hidden bg-[#f4efe5]">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Badge Destacado */}
                      {product.badge && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-[#3d5a4c]/90 backdrop-blur-xs text-[#dfc89f] text-[11px] font-bold shadow-sm">
                            {product.badge}
                          </span>
                        </div>
                      )}

                      {/* Categoría pill */}
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[#212924] text-[10px] font-semibold shadow-xs">
                          {product.categoryLabel}
                        </span>
                      </div>
                    </div>

                    {/* Contenido de la tarjeta */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-serif text-base sm:text-lg font-semibold text-[#212924] group-hover:text-[#3d5a4c] transition-colors line-clamp-2">
                          {product.name}
                        </h3>

                        <p className="text-xs text-[#5e7065] line-clamp-2 leading-relaxed">
                          {product.shortDescription}
                        </p>

                        {/* Beneficios clave */}
                        {product.benefits && product.benefits.length > 0 && (
                          <div className="pt-2 border-t border-[#f4efe5] space-y-1">
                            {product.benefits.slice(0, 2).map((b, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#4a584f]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#3d5a4c] flex-shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{b}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Precio y Botón Añadir */}
                      <div className="pt-3 border-t border-[#ece4d8] flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg sm:text-xl font-serif font-bold text-[#212924]">
                              {product.price.toFixed(2)}€
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-gray-400 line-through">
                                {product.originalPrice.toFixed(2)}€
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#718276] block">IVA incluido</span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                            isJustAdded
                              ? "bg-[#25D366] text-white scale-105"
                              : "bg-[#3d5a4c] hover:bg-[#2d473b] text-white hover:shadow"
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>¡Añadido!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4 text-[#dfc89f]" />
                              <span>Añadir</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Banner Cross-Sell: Combina tu compra con una sesión presencial */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#3d5a4c] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#dfc89f] font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Experiencia Integral</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold leading-snug">
                ¿Prefieres visitarnos y recibir asesoramiento en tienda?
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Reserva una sesión de quiromasaje descontracturante o armonización Reiki en nuestro espacio en Boiro. Podrás probar los aceites y elegir tus cristales directamente durante tu visita.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#2d473b] font-semibold text-sm shadow hover:bg-[#f6f2ea] transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#3d5a4c]" />
                <span>Pedir Cita Presencial</span>
              </button>
              <Link
                href="/#terapias"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
              >
                <span>Ver Terapias &rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Pie de página */}
      <Footer config={config} />

      {/* Modal interactivo de reservas */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        config={config}
        therapies={therapies}
      />
    </div>
  );
};
