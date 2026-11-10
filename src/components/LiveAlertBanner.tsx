import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Crown, Flame, ShoppingBag } from 'lucide-react';
import { LiveAlert } from '../types/game';

interface LiveAlertBannerProps {
  currentAlert: LiveAlert | null;
  onDismiss?: () => void;
}

export const LiveAlertBanner: React.FC<LiveAlertBannerProps> = ({ currentAlert, onDismiss }) => {
  useEffect(() => {
    if (!currentAlert) return;

    // Trigger celebration confetti for big achievements or big gifts
    if (
      currentAlert.gift.id === 'mishka_bear' ||
      currentAlert.gift.id === 'mini_dino' ||
      currentAlert.gift.id === 'donut' ||
      currentAlert.isJackpot ||
      currentAlert.skewers >= 20
    ) {
      try {
        confetti({
          particleCount: currentAlert.isJackpot || currentAlert.gift.id === 'mishka_bear' ? 80 : 40,
          spread: 70,
          origin: { y: 0.25 },
          colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#ef4444'],
        });
      } catch {
        // safety
      }
    }
  }, [currentAlert]);

  if (!currentAlert) return null;

  const isOrder = currentAlert.gift.category === 'order';

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-lg pointer-events-none animate-in fade-in slide-in-from-top-6 duration-300">
      <div
        className={`relative rounded-3xl p-1 bg-gradient-to-r ${
          isOrder
            ? 'from-amber-400 via-rose-500 to-pink-500 shadow-[0_10px_35px_rgba(244,63,94,0.45)]'
            : 'from-emerald-400 via-teal-500 to-cyan-500 shadow-[0_10px_35px_rgba(20,184,166,0.45)]'
        } border-2 border-white/60`}
      >
        <div className="relative rounded-[22px] bg-slate-950/90 backdrop-blur-md px-4 py-3 flex items-center gap-3 overflow-hidden">
          {/* Background Ambient Glow */}
          <div
            className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl ${
              isOrder ? 'bg-rose-500/30' : 'bg-emerald-500/30'
            }`}
          />

          {/* User Profile Avatar with TikTok Glowing Ring */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-pink-500 to-yellow-400 animate-spin" style={{ animationDuration: '4s' }}>
              <img
                src={currentAlert.user.avatar}
                alt={currentAlert.user.nickname}
                className="w-full h-full rounded-full object-cover border-2 border-slate-900"
                onError={(e) => {
                  // Fallback avatar if load fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            {/* TikTok Badge Pill */}
            <div className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-black border border-white/40 text-[9px] font-black text-cyan-300 flex items-center shadow">
              LIVE
            </div>
          </div>

          {/* Alert Content Info */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-sm text-white truncate max-w-[140px] drop-shadow-sm">
                @{currentAlert.user.nickname}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1">
                {currentAlert.gift.icon} {currentAlert.gift.nameTh}
              </span>
            </div>

            {/* Action Text */}
            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
              {isOrder ? (
                <>
                  <span className="flex items-center gap-1 text-xs font-semibold text-rose-300">
                    <ShoppingBag className="w-3.5 h-3.5 text-rose-400" />
                    สั่งปลาหมึกย่าง:
                  </span>
                  <span className="text-base font-black font-mono text-amber-300 bg-amber-950/60 px-2 py-0.2 rounded-md border border-amber-400/40 animate-pulse">
                    +{currentAlert.skewers} ไม้! 🍢
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-300">
                    <Flame className="w-3.5 h-3.5 text-emerald-400" />
                    ช่วยย่างปลาหมึก:
                  </span>
                  <span className="text-base font-black font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.2 rounded-md border border-emerald-400/40 animate-pulse">
                    +{currentAlert.skewers} ไม้! 👨‍🍳
                  </span>
                </>
              )}
            </div>

            {/* Jackpot Tag */}
            {currentAlert.isJackpot && (
              <div className="mt-1 flex items-center gap-1 text-[11px] font-black text-amber-300 animate-bounce">
                <Crown className="w-3.5 h-3.5 text-yellow-400" />
                แจ็กพอตสุ่มแตก! สั่งถล่มทลาย {currentAlert.skewers} ไม้! 🎉
              </div>
            )}
          </div>

          {/* Big Gift 3D Icon Stamp */}
          <div className="shrink-0 text-3xl sm:text-4xl animate-bounce" style={{ animationDuration: '1s' }}>
            {currentAlert.gift.icon}
          </div>
        </div>
      </div>
    </div>
  );
};
