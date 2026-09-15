"use client";

import React, { useState } from "react";
import { Table, Copy, Check, ExternalLink, X, RefreshCw, Sparkles, FileSpreadsheet } from "lucide-react";

export const GoogleSheetsBadge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [revalidateResult, setRevalidateResult] = useState<string | null>(null);

  const googleAppsScriptCode = `/**
 * Código de Google Apps Script para Google Sheets.
 * Añade un menú en la barra superior de la hoja:
 * "🌟 Web Aura" -> "🚀 Publicar Cambios en la Web"
 *
 * Configuración:
 * 1. En Google Sheets, ve a Extensiones > Apps Script.
 * 2. Pega este código reemplazando todo.
 * 3. Pon tu URL de Deploy Hook de Vercel o la URL de revalidación.
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🌟 Web Aura')
    .addItem('🚀 Publicar Cambios en la Web', 'triggerDeployWeb')
    .addToUi();
}

function triggerDeployWeb() {
  // Pega aquí la URL de tu Deploy Hook de Vercel:
  var vercelDeployHookUrl = "TU_DEPLOY_HOOK_DE_VERCEL";
  
  // O bien la URL de revalidación instantánea:
  // var revalidateUrl = "https://tu-dominio.vercel.app/api/revalidate?secret=aura-pepi-secret-key";

  var response = UrlFetchApp.fetch(vercelDeployHookUrl, {
    method: "post"
  });

  SpreadsheetApp.getUi().alert(
    '✅ ¡Publicación Solicitada!',
    'Vercel está optimizando las fotos de Google Drive y actualizando los textos. En 30-45 segundos los cambios serán visibles en la web.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(googleAppsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleTestRevalidate = async () => {
    setIsRevalidating(true);
    setRevalidateResult(null);
    try {
      const res = await fetch("/api/revalidate?secret=aura-pepi-secret-key");
      const data = await res.json();
      if (res.ok) {
        setRevalidateResult("¡Caché revalidada con éxito! Datos sincronizados.");
      } else {
        setRevalidateResult(data.message || "Error al revalidar");
      }
    } catch {
      setRevalidateResult("Error de conexión al revalidar");
    } finally {
      setIsRevalidating(false);
    }
  };

  return (
    <>
      {/* Botón flotante discreto */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#212924] text-[#dfc89f] text-xs font-semibold shadow-lg hover:bg-black transition-all border border-[#3d5a4c] cursor-pointer"
          title="Panel de conexión con Google Sheets y Google Drive"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#25D366]" />
          <span>Gestión Google Sheet</span>
        </button>
      </div>

      {/* Modal explicativo */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#ece4d8] overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-[#212924] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#25D366]" />
                <h3 className="font-semibold text-base">Cómo Funciona la Conexión con Google Sheets</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-sm text-[#38463e]">
              
              <div className="bg-[#f4f7f5] p-4 rounded-2xl border border-[#cbdbd0]">
                <h4 className="font-bold text-[#2d473b] text-xs uppercase tracking-wider mb-1">
                  1. Edición sin conocimientos técnicos
                </h4>
                <p className="text-xs leading-relaxed text-[#4d5c52]">
                  La clienta tiene una hoja de cálculo en su Google Drive con pestañas para <strong>Terapias</strong>, <strong>Talleres</strong>, <strong>Armonización</strong> y <strong>Reseñas</strong>.
                  Puede modificar precios, textos o añadir fotos pegando el enlace compartido de Google Drive.
                </p>
              </div>

              <div className="bg-[#f4f7f5] p-4 rounded-2xl border border-[#cbdbd0]">
                <h4 className="font-bold text-[#2d473b] text-xs uppercase tracking-wider mb-1">
                  2. Optimización automática de imágenes de Google Drive
                </h4>
                <p className="text-xs leading-relaxed text-[#4d5c52]">
                  Las fotos de Google Drive se convierten automáticamente en la CDN a formato moderno ultraligero (<strong>WebP / AVIF</strong>). La web no realiza consultas a Google Drive en cada visita, garantizando una carga instantánea de menos de 1 segundo.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-[#212924] text-xs uppercase tracking-wider">
                    3. Código para el Botón en Google Sheets:
                  </h4>
                  <button
                    onClick={handleCopyScript}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#eaf0ec] text-[#2d473b] text-xs font-semibold hover:bg-[#cbdbd0] transition-colors cursor-pointer"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Apps Script</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-[#1e2621] text-[#cbdbd0] text-[11px] font-mono overflow-x-auto max-h-48">
                  {googleAppsScriptCode}
                </pre>
              </div>

              <div className="pt-2 border-t border-[#ece4d8] flex items-center justify-between">
                <button
                  onClick={handleTestRevalidate}
                  disabled={isRevalidating}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3d5a4c] text-white text-xs font-semibold hover:bg-[#2c4238] transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRevalidating ? "animate-spin" : ""}`} />
                  <span>Probar Revalidación de Caché</span>
                </button>

                {revalidateResult && (
                  <span className="text-xs text-emerald-700 font-medium">
                    {revalidateResult}
                  </span>
                )}
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
};
