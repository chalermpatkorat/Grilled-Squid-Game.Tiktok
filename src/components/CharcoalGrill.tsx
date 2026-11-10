import React, { useState } from 'react';
import { Flame, Wind, Sparkles, Plus, RotateCw, CheckCircle2, Clock } from 'lucide-react';
import { soundService } from '../services/soundService';
import { GrillingSkewer } from '../types/game';

interface CharcoalGrillProps {
  skewersOnGrill: GrillingSkewer[];
  onFlipSkewer: (skewerId: string) => void;
  onFlipAllSkewers: () => void;
  onCollectSkewer: (skewerId: string) => void;
  onCollectAllCooked: () => void;
  onFanFlames?: () => void;
  onManualGrill?: (count: number) => void;
}

export const CharcoalGrill: React.FC<CharcoalGrillProps> = ({
  skewersOnGrill,
  onFlipSkewer,
  onFlipAllSkewers,
  onCollectSkewer,
  onCollectAllCooked,
  onFanFlames,
  onManualGrill,
}) => {
  const [fanned, setFanned] = useState(false);
  const [flippingSkewerId, setFlippingSkewerId] = useState<string | null>(null);

  const handleFan = () => {
    setFanned(true);
    soundService.playGrillSizzle();
    if (onFanFlames) onFanFlames();
    setTimeout(() => setFanned(false), 600);
  };

  const handleSkewerClick = (skewer: GrillingSkewer) => {
    if (skewer.stage === 'need_flip') {
      setFlippingSkewerId(skewer.id);
      soundService.playGrillSizzle();
      onFlipSkewer(skewer.id);
      setTimeout(() => setFlippingSkewerId(null), 450);
    } else if (skewer.stage === 'cooked') {
      soundService.playOrderChime();
      onCollectSkewer(skewer.id);
    }
  };

  // Count skewers that need flip or are cooked
  const needFlipCount = skewersOnGrill.filter((s) => s.stage === 'need_flip').length;
  const cookedCount = skewersOnGrill.filter((s) => s.stage === 'cooked').length;
  const totalSkewersCount = skewersOnGrill.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="relative w-full rounded-3xl p-1 bg-gradient-to-b from-orange-400 via-red-600 to-rose-950 shadow-[0_12px_28px_rgba(239,68,68,0.25)]">
      <div className="rounded-[22px] bg-gradient-to-b from-stone-900 via-neutral-900 to-black p-3.5 border border-red-500/30 flex flex-col justify-between min-h-[235px]">
        
        {/* Header: Title and Quick Skewers Count */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-full bg-red-500/20 text-red-400">
              <Flame className="w-4 h-4 animate-bounce text-red-400" />
            </span>
            <span className="font-extrabold text-sm text-red-200 tracking-wide">
              เตาย่างถ่านไม้ซอสเด็ด 🔥
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {skewersOnGrill.length > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white text-[11px] font-bold border border-orange-400/40 animate-pulse flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                บนเตา: {totalSkewersCount} ไม้
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 text-[11px] font-mono">
                ไฟพร้อมย่าง
              </span>
            )}
          </div>
        </div>

        {/* 3D Charcoal Grill Surface */}
        <div
          onClick={handleFan}
          className="relative my-2 min-h-[125px] rounded-xl bg-gradient-to-b from-stone-950 via-zinc-900 to-stone-950 border-2 border-stone-700/80 p-2 overflow-hidden cursor-pointer group flex items-center justify-center"
        >
          {/* Animated Rising Smoke */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute left-1/4 top-3 text-lg opacity-40 animate-[smokeDrift_3s_infinite]">
              💨
            </div>
            <div className="absolute left-1/2 top-1 text-xl opacity-30 animate-[smokeDrift_3.5s_infinite_0.8s]">
              💨
            </div>
            <div className="absolute left-3/4 top-2 text-base opacity-40 animate-[smokeDrift_2.7s_infinite_1.5s]">
              💨
            </div>
          </div>

          {/* Glowing Charcoal Briquettes Underneath */}
          <div className="absolute inset-x-2 bottom-1 h-6 flex justify-around items-end opacity-90">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-4 rounded-md bg-gradient-to-t from-red-600 via-orange-500 to-amber-300 animate-coal ${
                  fanned ? 'scale-125 brightness-150' : ''
                } transition-all duration-300 shadow-[0_0_12px_rgba(249,115,22,0.8)]`}
                style={{ animationDelay: `${(i % 3) * 0.4}s` }}
              />
            ))}
          </div>

          {/* Steel Grill Grate Bars */}
          <div className="absolute inset-x-0 inset-y-1 flex justify-evenly pointer-events-none z-10 opacity-60">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-0.5 h-full bg-stone-400/80 shadow" />
            ))}
          </div>

          {/* Skewers on the Grill with Live Clocks & Flip Triggers */}
          <div className="relative z-20 flex items-center justify-center gap-2 sm:gap-3 flex-wrap py-1 w-full">
            {skewersOnGrill.length > 0 ? (
              skewersOnGrill.map((skewer) => {
                const isFlipping = flippingSkewerId === skewer.id;
                const isCooked = skewer.stage === 'cooked';
                const needFlip = skewer.stage === 'need_flip';

                return (
                  <div
                    key={skewer.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSkewerClick(skewer);
                    }}
                    className={`group relative flex flex-col items-center cursor-pointer transition-transform duration-200 select-none ${
                      isFlipping ? 'animate-flip-3d' : 'hover:scale-105 active:scale-95'
                    }`}
                  >
                    {/* Live Clock / Notification Badge above skewer */}
                    <div className="mb-1">
                      {skewer.stage === 'grilling_side_a' && (
                        <div className="px-1.5 py-0.5 rounded-full bg-slate-900/90 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold flex items-center gap-0.5 shadow">
                          <Clock className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '3s' }} />
                          <span>{skewer.currentSecondsLeft}s</span>
                        </div>
                      )}

                      {needFlip && (
                        <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white border border-amber-300 text-[10px] font-black flex items-center gap-1 shadow-lg animate-timer-pulse">
                          <RotateCw className="w-3 h-3 animate-spin" />
                          <span>พลิก!</span>
                        </div>
                      )}

                      {skewer.stage === 'grilling_side_b' && (
                        <div className="px-1.5 py-0.5 rounded-full bg-slate-900/90 text-orange-400 border border-orange-400/40 text-[10px] font-mono font-bold flex items-center gap-0.5 shadow">
                          <Clock className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '3s' }} />
                          <span>{skewer.currentSecondsLeft}s</span>
                        </div>
                      )}

                      {isCooked && (
                        <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white border border-emerald-300 text-[10px] font-black flex items-center gap-1 shadow-lg animate-bounce">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>สุกแล้ว!</span>
                        </div>
                      )}
                    </div>

                    {/* 3D Squid Skewer Body */}
                    <div className="relative flex flex-col items-center">
                      <div className="w-1.5 h-2.5 bg-amber-200 rounded-t-sm" />

                      {/* Squid Body */}
                      <div
                        className={`relative w-8 h-10 rounded-t-lg rounded-b-md shadow-md flex flex-col items-center justify-center overflow-hidden border ${
                          isCooked
                            ? 'bg-gradient-to-b from-amber-600 via-orange-600 to-amber-700 border-amber-400'
                            : skewer.isFlipped
                            ? 'bg-gradient-to-b from-orange-400 via-amber-600 to-orange-600 border-amber-400/80'
                            : 'bg-gradient-to-b from-pink-300 via-rose-400 to-orange-400 border-pink-300/80'
                        }`}
                      >
                        {/* Savory chili glaze shine & char marks */}
                        {(skewer.isFlipped || isCooked) && (
                          <>
                            <div className="w-6 h-0.5 bg-black/60 rounded-full mb-1 rotate-[-3deg]" />
                            <div className="w-5 h-0.5 bg-black/60 rounded-full mb-1 rotate-[2deg]" />
                            <div className="w-6 h-0.5 bg-black/60 rounded-full rotate-[-1deg]" />
                          </>
                        )}
                      </div>

                      {/* Tentacles */}
                      <div className="flex gap-0.5 -mt-0.5">
                        <div
                          className={`w-1.5 h-3 rounded-full -rotate-12 ${
                            isCooked ? 'bg-amber-700' : 'bg-rose-400'
                          }`}
                        />
                        <div
                          className={`w-1.5 h-3.5 rounded-full ${
                            isCooked ? 'bg-amber-700' : 'bg-rose-500'
                          }`}
                        />
                        <div
                          className={`w-1.5 h-3 rounded-full rotate-12 ${
                            isCooked ? 'bg-amber-700' : 'bg-rose-400'
                          }`}
                        />
                      </div>

                      <div className="w-1.5 h-3.5 bg-amber-200 rounded-b-sm" />
                    </div>

                    {/* Batch skewer counter badge if > 1 */}
                    {skewer.count > 1 && (
                      <span className="mt-0.5 px-1 rounded bg-black/70 text-[9px] font-bold text-amber-200">
                        x{skewer.count}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center z-20 py-4">
                <p className="text-xs font-semibold text-stone-400 group-hover:text-amber-300 transition-colors">
                  🔥 กดปุ่ม "ขึ้นเตาย่าง" เพื่อวางปลาหมึกสด หรือแตะพัดเตาถ่าน
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions: Flip All / Collect Cooked / Fan / Add Skewers */}
        <div className="flex items-center justify-between pt-1 gap-1.5 flex-wrap">
          {/* Left: Quick Grilling Controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {needFlipCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundService.playGrillSizzle();
                  onFlipAllSkewers();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-black shadow transition-transform active:scale-95 animate-timer-pulse"
              >
                <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                พลิกทุกไม้ ({needFlipCount}) 🔄
              </button>
            )}

            {cookedCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundService.playOrderChime();
                  onCollectAllCooked();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black shadow transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                เก็บสุกแล้วขึ้นถาด ({cookedCount}) 🍢
              </button>
            )}

            <button
              onClick={handleFan}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-bold border border-stone-700 transition-transform active:scale-95"
            >
              <Wind className="w-3 h-3 text-cyan-300" />
              พัดไฟ!
            </button>
          </div>

          {/* Right: Quick Add Skewer */}
          {onManualGrill && (
            <button
              onClick={() => onManualGrill(1)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-[11px] font-black border border-orange-400/40 shadow transition-transform active:scale-95 ml-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              ขึ้นเตา 1 ไม้
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
