import React from 'react';
import { Flame, CheckCircle, Package, Send, Users } from 'lucide-react';
import { OrderItem } from '../types/game';

interface ReadyTrayProps {
  readyCount: number;
  pendingOrders: OrderItem[];
  onServeOrder: (orderId: string) => void;
  onServeAllOrders: () => void;
  onQuickServe?: () => void;
}

export const ReadyTray: React.FC<ReadyTrayProps> = ({
  readyCount,
  pendingOrders,
  onServeOrder,
  onServeAllOrders,
  onQuickServe,
}) => {
  const visualSkewers = Math.min(Math.max(readyCount > 0 ? 3 : 0, Math.min(readyCount, 8)), 8);
  const totalPendingSkewers = pendingOrders.reduce((acc, curr) => acc + curr.skewers, 0);

  return (
    <div className="relative w-full rounded-3xl p-1 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 shadow-[0_12px_28px_rgba(217,119,6,0.3)]">
      {/* 3D Tray Frame */}
      <div className="rounded-[22px] bg-gradient-to-b from-stone-800 via-stone-900 to-neutral-950 p-3 border border-amber-300/40 shadow-inner flex flex-col justify-between min-h-[220px]">
        {/* Tray Header */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍢</span>
            <span className="font-extrabold text-sm text-amber-300 tracking-wide">
              ถาดปลาหมึกย่างพร้อมขาย
            </span>
          </div>

          {/* Big, eye-catching Ready Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-md border border-amber-300/60 animate-pulse">
            <CheckCircle className="w-4 h-4 text-amber-100" />
            <span className="text-xs font-medium text-amber-100">รอขาย:</span>
            <span className="text-base font-black font-mono tracking-tight text-white drop-shadow">
              {readyCount} ไม้
            </span>
          </div>
        </div>

        {/* Display Plate Surface */}
        <div className="relative flex-1 my-2 rounded-xl bg-gradient-to-b from-stone-900/90 via-stone-800/80 to-stone-900/90 border border-stone-700/60 p-2 flex items-center justify-center overflow-hidden min-h-[90px]">
          {/* Subtle bamboo banana leaf mat under skewers */}
          <div className="absolute inset-2 rounded-lg bg-gradient-to-r from-emerald-950/60 via-green-900/40 to-emerald-950/60 border border-emerald-600/20 pointer-events-none" />

          {readyCount === 0 ? (
            <div className="relative z-10 flex flex-col items-center justify-center py-2 text-center">
              <span className="text-2xl opacity-40 mb-1">🍢</span>
              <p className="text-xs font-semibold text-amber-200/60">
                ถาดว่าง! กดปุ่ม "เอาหมึกขึ้นเตาย่าง" เพื่อย่างเติมสต็อกได้เลย 🔥
              </p>
            </div>
          ) : (
            <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 flex-wrap py-1 w-full">
              {Array.from({ length: visualSkewers }).map((_, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col items-center transition-all duration-300 hover:scale-110 cursor-pointer"
                  style={{
                    transform: `rotate(${(i - visualSkewers / 2) * 4}deg) translateY(${Math.sin(i) * 2}px)`,
                  }}
                >
                  {/* Delicious Golden-Grilled 3D Squid Skewer */}
                  <div className="relative flex flex-col items-center">
                    <div className="w-1.5 h-3 bg-amber-200 rounded-t-sm shadow-sm" />
                    <div className="relative w-8 h-10 rounded-t-xl rounded-b-lg bg-gradient-to-b from-amber-600 via-orange-600 to-amber-700 border border-amber-400/60 shadow-md flex flex-col items-center justify-center overflow-hidden">
                      <div className="absolute top-1 left-1 w-2 h-3 bg-white/40 rounded-full blur-[0.5px]" />
                      <div className="w-6 h-0.5 bg-stone-900/70 rounded-full mb-1 rotate-[-4deg]" />
                      <div className="w-5 h-0.5 bg-stone-900/70 rounded-full mb-1 rotate-[3deg]" />
                      <div className="w-6 h-0.5 bg-stone-900/70 rounded-full rotate-[-2deg]" />
                      <div className="absolute bottom-1 right-1 w-1 h-1 bg-emerald-400 rounded-full" />
                      <div className="absolute top-2 right-1.5 w-1 h-1 bg-emerald-300 rounded-full" />
                    </div>
                    <div className="flex gap-0.5 -mt-1">
                      <div className="w-1.5 h-3.5 bg-gradient-to-b from-amber-700 to-orange-800 rounded-full -rotate-12" />
                      <div className="w-1.5 h-4 bg-gradient-to-b from-amber-700 to-orange-800 rounded-full rotate-3" />
                      <div className="w-1.5 h-3.5 bg-gradient-to-b from-amber-700 to-orange-800 rounded-full rotate-12" />
                    </div>
                    <div className="w-1.5 h-5 bg-gradient-to-b from-amber-200 to-amber-300 rounded-b-sm shadow" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feature: Send / Deliver to Customers (เอาปลาหมึกส่งให้ลูกค้า) */}
        <div className="pt-2 border-t border-stone-800/80 space-y-2">
          {pendingOrders.length > 0 ? (
            <div className="p-2 rounded-xl bg-slate-900/90 border border-rose-500/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Users className="w-4 h-4 text-rose-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    มี {pendingOrders.length} ออเดอร์รอรับ ({totalPendingSkewers} ไม้)
                  </p>
                  <p className="text-[10px] text-amber-300">
                    {readyCount >= totalPendingSkewers
                      ? 'สต็อกบนถาดพร้อมส่งแล้ว!'
                      : `ขาดอีก ${Math.max(0, totalPendingSkewers - readyCount)} ไม้ (ย่างเพิ่มด่วน)`}
                  </p>
                </div>
              </div>

              <button
                onClick={onServeAllOrders}
                disabled={readyCount < 1}
                className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-md flex items-center gap-1 shrink-0 transition-transform active:scale-95 ${
                  readyCount >= 1
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                ส่งให้ลูกค้าทันที! 📦
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-amber-300/80">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[11px] font-medium">ไม่มีออเดอร์ค้าง พร้อมรับลูกค้า</span>
              </div>

              {readyCount > 0 && onQuickServe && (
                <button
                  onClick={onQuickServe}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold border border-amber-400/30 transition-transform active:scale-95"
                >
                  <Send className="w-3 h-3" />
                  ส่งขายหน้าร้าน (+1 ไม้)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
