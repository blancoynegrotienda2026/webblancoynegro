"use client";

import React from "react";
import { SiteConfig } from "@/types/content";
import { Calendar, Clock, MessageCircle, Sparkles, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";

interface BookingSectionProps {
  config: SiteConfig;
  onOpenBooking: () => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ config, onOpenBooking }) => {
  return (
    <section id="citas" className="py-24 bg-[#3d5a4c] text-white relative overflow-hidden">
      {/* Elementos de aura sutil */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#dfc89f]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Columna Izquierda */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#dfc89f] text-xs font-semibold mb-4">
              <Calendar className="w-3.5 h-3.5" />
              <span>Agenda y Citas Online</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-tight mb-6">
              Tu momento de paz comienza con un solo paso.
            </h2>

            <p className="text-base sm:text-lg text-white/85 leading-relaxed mb-8">
              Atendemos siempre de manera individualizada y con margen suficiente entre sesiones para que disfrutes de tu cita sin prisas, con tiempo para respirar y recuperar sensaciones.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#dfc89f] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/90">
                  Confirmación inmediata de tu día y franja horaria preferida.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#dfc89f] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/90">
                  Cancelación o cambio de cita flexible avisando con 24h de antelación.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#dfc89f] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/90">
                  Posibilidad de sesiones a domicilio o en fines de semana bajo consulta.
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-[#212924] font-semibold text-sm hover:bg-[#dfc89f] transition-all shadow-lg cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#3d5a4c]" />
                <span>Abrir Asistente de Citas</span>
              </button>

              <a
                href={`https://wa.me/${config.whatsapp}?text=Hola%20${encodeURIComponent(
                  config.name
                )},%20quisiera%20consultar%20disponibilidad%20de%20citas%20para%20esta%20semana.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/10 border border-white/20 text-white font-medium text-sm hover:bg-white/20 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Escribir por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta con Horarios y Ubicación */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6">
              <div className="border-b border-white/15 pb-5">
                <span className="text-xs uppercase tracking-wider text-[#dfc89f] font-semibold block mb-1">
                  Horario de Atención
                </span>
                <p className="text-lg font-serif font-medium">{config.schedule}</p>
              </div>

              <div className="border-b border-white/15 pb-5">
                <span className="text-xs uppercase tracking-wider text-[#dfc89f] font-semibold block mb-1">
                  Ubicación del Espacio y Tienda
                </span>
                <p className="text-base font-medium">{config.address}</p>
                <p className="text-xs text-white/80 mt-0.5">{config.city}</p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-[#dfc89f] font-semibold block mb-1">
                  Integración Google Calendar
                </span>
                <p className="text-xs text-white/80 leading-relaxed mb-3">
                  Sincronizado en tiempo real con nuestra agenda para evitar esperas y solapamientos.
                </p>
                <a
                  href={config.googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#dfc89f] font-semibold hover:underline"
                >
                  <span>Abrir agenda de Google Calendar &rarr;</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
