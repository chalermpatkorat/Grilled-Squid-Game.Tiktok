import React, { useState } from 'react';
import { Sparkles, Fish, RefreshCw, Flame } from 'lucide-react';
import { soundService } from '../services/soundService';

interface AquariumTankProps {
  squidCount: number;
  onTapSquid?: () => void;
  onRefillTank?: () => void;
  onPutSquidOnGrill?: (count: number) => void;
  isGrillingActive?: boolean;
}

interface CuteSquid {
  id: number;
  x: number;
  y: number;
  color: string;
  faceExpression: 'happy' | 'cute' | 'wink' | 'shy';
  delay: number;
  scale: number;
}

export const AquariumTank: React.FC<AquariumTankProps> = ({
  squidCount,
  onTapSquid,
  onRefillTank,
  onPutSquidOnGrill,
  isGrillingActive,
}) => {
  const [tapEffect, setTapEffect] = useState<{ x: number; y: number; id: number } | null>(null);

  const squids: CuteSquid[] = [
    { id: 1, x: 22, y: 35, color: 'from-pink-400 to-rose-500', faceExpression: 'happy', delay: 0, scale: 1 },
    { id: 2, x: 68, y: 28, color: 'from-amber-300 to-orange-400', faceExpression: 'cute', delay: 1.2, scale: 0.9 },
    { id: 3, x: 45, y: 62, color: 'from-purple-400 to-pink-500', faceExpression: 'wink', delay: 0.6, scale: 1.05 },
    { id: 4, x: 80, y: 68, color: 'from-sky-300 to-blue-500', faceExpression: 'shy', delay: 1.8, scale: 0.85 },
    { id: 5, x: 18, y: 72, color: 'from-emerald-300 to-teal-400', faceExpression: 'happy', delay: 2.3, scale: 0.95 },
  ];

  const handleTankClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTapEffect({ x, y, id: Date.now() });
    soundService.playLikePop();
    if (onTapSquid) onTapSquid();

    setTimeout(() => {
      setTapEffect(null);
    }, 800);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden p-1 bg-gradient-to-b from-sky-400/40 via-cyan-500/20 to-teal-600/30 border-2 border-cyan-300/60 shadow-[0_12px_30px_rgba(6,182,212,0.25)] flex flex-col justify-between">
      {/* 3D Glass Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-cyan-600/80 via-sky-500/80 to-blue-600/80 rounded-t-2xl text-white text-xs font-bold tracking-wide shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="p-1 rounded-full bg-cyan-300/30 text-cyan-100">
            <Fish className="w-3.5 h-3.5 animate-pulse" />
          </span>
          <span className="drop-shadow">ตู้ปลาหมึกสดว่ายน้ำ 🦑</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-200 text-[11px] font-mono border border-cyan-400/30">
            เหลือ {squidCount} ตัว
          </span>
          {onRefillTank && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRefillTank();
              }}
              title="เติมปลาหมึกสดลงตู้"
              className="p-1 hover:bg-cyan-400/30 rounded-lg text-cyan-100 active:scale-90 transition-transform"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Aquarium Glass Body */}
      <div
        onClick={handleTankClick}
        className="relative h-48 md:h-56 w-full cursor-pointer select-none overflow-hidden bg-gradient-to-b from-cyan-400/20 via-sky-500/30 to-blue-700/50 shadow-inner"
      >
        {/* Water Surface Shimmer */}
        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-cyan-200/40 to-transparent pointer-events-none" />

        {/* Ambient Bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-[15%] bottom-1 w-2 h-2 rounded-full bg-cyan-200/60 animate-[bubbleFloat_3.2s_infinite]" />
          <div className="absolute left-[35%] bottom-2 w-3 h-3 rounded-full bg-cyan-100/50 animate-[bubbleFloat_4.5s_infinite_0.8s]" />
          <div className="absolute left-[62%] bottom-0 w-2.5 h-2.5 rounded-full bg-white/50 animate-[bubbleFloat_3.8s_infinite_1.5s]" />
          <div className="absolute left-[82%] bottom-3 w-1.5 h-1.5 rounded-full bg-cyan-200/70 animate-[bubbleFloat_2.9s_infinite_0.4s]" />
          <div className="absolute left-[50%] bottom-2 w-2 h-2 rounded-full bg-white/40 animate-[bubbleFloat_5s_infinite_2s]" />
        </div>

        {/* Coral & Pebbles at the bottom */}
        <div className="absolute bottom-0 inset-x-0 h-8 flex items-end justify-between px-3 pointer-events-none opacity-80">
          <div className="flex gap-1 items-end">
            <span className="text-xl transform -rotate-6">🪸</span>
            <span className="text-sm transform rotate-12">🌿</span>
          </div>
          <div className="flex gap-1.5 text-xs text-amber-200/50">
            <span>🪨</span>
            <span>🐚</span>
            <span>🪨</span>
          </div>
          <div className="flex gap-1 items-end">
            <span className="text-sm transform -rotate-12">🌿</span>
            <span className="text-2xl transform rotate-6">🪸</span>
          </div>
        </div>

        {/* Cute Swimming 3D Squids */}
        {squids.map((squid) => (
          <div
            key={squid.id}
            style={{
              left: `${squid.x}%`,
              top: `${squid.y}%`,
              animationDelay: `${squid.delay}s`,
              transform: `scale(${squid.scale})`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 animate-swim group transition-transform duration-300 hover:scale-125"
          >
            {/* 3D Cute Squid Body */}
            <div className="relative flex flex-col items-center">
              <div
                className={`relative w-12 h-14 rounded-t-full rounded-b-2xl bg-gradient-to-b ${squid.color} shadow-[0_6px_14px_rgba(0,0,0,0.25)] border border-white/50 flex flex-col items-center pt-2`}
              >
                <div className="absolute top-2 left-2 w-3 h-4 bg-white/50 rounded-full rotate-[-25deg] blur-[0.5px]" />
                <div className="flex gap-2.5 items-center mt-3 z-10">
                  <div className="relative w-3.5 h-4 bg-slate-900 rounded-full flex items-center justify-center shadow-inner">
                    <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full" />
                    <div className="absolute bottom-0.5 right-0.5 w-0.8 h-0.8 bg-white/80 rounded-full" />
                  </div>
                  <div className="relative w-3.5 h-4 bg-slate-900 rounded-full flex items-center justify-center shadow-inner">
                    <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full" />
                    <div className="absolute bottom-0.5 right-0.5 w-0.8 h-0.8 bg-white/80 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <div className="w-2 h-1 bg-rose-400/70 rounded-full blur-[0.5px]" />
                  <div className="w-1.5 h-1 border-b-2 border-slate-800 rounded-full" />
                  <div className="w-2 h-1 bg-rose-400/70 rounded-full blur-[0.5px]" />
                </div>
              </div>

              <div className="flex gap-1 -mt-1 animate-tentacle">
                <div className="w-1.5 h-4 bg-gradient-to-b from-pink-400 to-rose-400 rounded-full -rotate-12 origin-top" />
                <div className="w-1.5 h-5 bg-gradient-to-b from-pink-400 to-rose-500 rounded-full rotate-6 origin-top" />
                <div className="w-1.5 h-5 bg-gradient-to-b from-pink-400 to-rose-500 rounded-full -rotate-6 origin-top" />
                <div className="w-1.5 h-4 bg-gradient-to-b from-pink-400 to-rose-400 rounded-full rotate-12 origin-top" />
              </div>
            </div>
          </div>
        ))}

        {/* Tap Ripple Effect */}
        {tapEffect && (
          <div
            style={{ left: tapEffect.x, top: tapEffect.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full border-2 border-cyan-200 animate-ping" />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-cyan-100 bg-cyan-950/70 px-2 py-0.5 rounded-full border border-cyan-400/40">
              จ๊ะเอ๋! 💦
            </div>
          </div>
        )}

        {/* Grilling Splash Indicator */}
        {isGrillingActive && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 animate-bounce">
            <Sparkles className="w-3 h-3" />
            กำลังส่งปลาหมึกขึ้นเตาย่าง!
          </div>
        )}
      </div>

      {/* Host Manual Grilling Action Bar */}
      {onPutSquidOnGrill && (
        <div className="p-2 bg-slate-900/95 rounded-b-2xl border-t border-cyan-500/30 flex items-center justify-between gap-1.5">
          <span className="text-[11px] font-extrabold text-cyan-200 flex items-center gap-1 pl-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            ผู้เล่นหยิบหมึกย่าง:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPutSquidOnGrill(1)}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-xs font-black shadow transition-transform active:scale-90 flex items-center gap-1"
            >
              +1 ไม้
            </button>
            <button
              onClick={() => onPutSquidOnGrill(5)}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-xs font-black shadow transition-transform active:scale-90 flex items-center gap-1"
            >
              +5 ไม้ 🔥
            </button>
            <button
              onClick={() => onPutSquidOnGrill(10)}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-xs font-black shadow transition-transform active:scale-90 flex items-center gap-1"
            >
              +10 ไม้
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
