import React, { useState } from 'react';
import { ShoppingBag, Flame, Heart, Sparkles, Send } from 'lucide-react';
import { GIFT_DEFINITIONS, GiftId } from '../types/game';
import { soundService } from '../services/soundService';

interface TikTokGiftGuideProps {
  onTriggerGift: (giftId: GiftId, customCount?: number) => void;
  onTapLike: () => void;
  currentLikesPool: number;
}

export const TikTokGiftGuide: React.FC<TikTokGiftGuideProps> = ({
  onTriggerGift,
  onTapLike,
  currentLikesPool,
}) => {
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number }[]>([]);

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundService.playLikePop();
    onTapLike();

    // Spawn floating heart
    const newHeart = {
      id: Date.now() + Math.random(),
      left: 30 + Math.random() * 40,
    };
    setFloatingHearts((prev) => [...prev.slice(-8), newHeart]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1500);
  };

  const orderGifts: GiftId[] = ['rose', 'finger_heart', 'perfume', 'donut', 'cap_mustache'];
  const helperGifts: GiftId[] = ['thumbs_up', 'mini_dino', 'mishka_bear'];

  return (
    <div className="w-full space-y-3">
      {/* Tap Heart Bar: เคาะจอเคาะใจ */}
      <div className="relative rounded-2xl p-0.5 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 shadow-md">
        <div className="rounded-[15px] bg-slate-950/90 backdrop-blur-md px-3 py-2 flex items-center justify-between overflow-hidden">
          {/* Floating Hearts Container */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {floatingHearts.map((h) => (
              <span
                key={h.id}
                style={{ left: `${h.left}%` }}
                className="absolute bottom-1 text-2xl animate-float-heart"
              >
                ❤️
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl animate-pulse">❤️</span>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1">
                เคาะจอเคาะใจ ช่วยย่างปลาหมึก
                <span className="text-[10px] text-rose-300 font-normal">
                  (ครบ 100 ใจ = ช่วยย่าง 1 ไม้)
                </span>
              </p>
              {/* Progress bar towards 100 likes */}
              <div className="w-36 sm:w-52 h-2 rounded-full bg-slate-800 mt-1 overflow-hidden border border-rose-500/30">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-150"
                  style={{ width: `${(currentLikesPool / 100) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <span className="text-xs font-mono font-bold text-rose-300">
              {currentLikesPool}/100
            </span>
            <button
              onClick={handleLikeClick}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white text-xs font-black shadow-lg flex items-center gap-1 active:scale-90 transition-transform"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              เคาะใจ!
            </button>
          </div>
        </div>
      </div>

      {/* Gift Rules & Quick Trigger Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Section 1: กติกาของขวัญสำหรับ "สั่งซื้อปลาหมึกย่าง" */}
        <div className="rounded-2xl p-3 bg-slate-900/80 border border-rose-500/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-xs font-extrabold text-rose-300 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-rose-400" />
                ของขวัญสำหรับ "สั่งซื้อ" ปลาหมึกย่าง 🍢
              </span>
              <span className="text-[10px] text-slate-400">กดจำลองส่งได้</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {orderGifts.map((gid) => {
                const item = GIFT_DEFINITIONS[gid];
                return (
                  <button
                    key={gid}
                    onClick={() => onTriggerGift(gid)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-rose-400/50 flex flex-col items-center text-center transition-all active:scale-95 group"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-125 transition-transform">
                      {item.icon}
                    </span>
                    <span className="text-[11px] font-bold text-white truncate w-full">
                      {item.nameTh}
                    </span>
                    <span className="text-[10px] font-extrabold text-rose-300 mt-0.5">
                      {item.isJackpot ? 'สุ่ม 20-100 ไม้' : `สั่ง ${item.skewers} ไม้`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: กติกาของขวัญสำหรับ "ช่วยย่างปลาหมึก" */}
        <div className="rounded-2xl p-3 bg-slate-900/80 border border-emerald-500/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-emerald-400" />
                ของขวัญสำหรับ "ช่วยย่าง" ปลาหมึก 👨‍🍳🔥
              </span>
              <span className="text-[10px] text-slate-400">กดจำลองส่งได้</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {helperGifts.map((gid) => {
                const item = GIFT_DEFINITIONS[gid];
                return (
                  <button
                    key={gid}
                    onClick={() => onTriggerGift(gid)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-emerald-400/50 flex flex-col items-center text-center transition-all active:scale-95 group"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-125 transition-transform">
                      {item.icon}
                    </span>
                    <span className="text-[11px] font-bold text-white truncate w-full">
                      {item.nameTh}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-300 mt-0.5">
                      ช่วย {item.skewers} ไม้
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
