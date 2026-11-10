import React from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Flame, ShoppingBag, Heart, Clock, Award, RotateCcw, X, Share2 } from 'lucide-react';
import { HelperRecord, BuyerRecord, LiveSessionStats, GIFT_DEFINITIONS, GiftId } from '../types/game';

interface EndLiveSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestartSession: () => void;
  stats: LiveSessionStats;
  helpers: HelperRecord[];
  buyers: BuyerRecord[];
}

export const EndLiveSummaryModal: React.FC<EndLiveSummaryModalProps> = ({
  isOpen,
  onClose,
  onRestartSession,
  stats,
  helpers,
  buyers,
}) => {
  if (!isOpen) return null;

  // Calculate live duration
  const now = stats.endTime || Date.now();
  const diffSec = Math.max(0, Math.floor((now - stats.startTime) / 1000));
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;
  const durationStr = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const topHelper = [...helpers].sort((a, b) => b.skewersGrilled - a.skewersGrilled)[0];
  const topBuyer = [...buyers].sort((a, b) => b.skewersOrdered - a.skewersOrdered)[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl p-1 bg-gradient-to-b from-amber-400 via-orange-500 to-rose-600 shadow-2xl">
        <div className="rounded-[22px] bg-slate-950 p-5 md:p-6 text-white max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center pb-4 border-b border-slate-800">
            <span className="inline-block p-3 rounded-full bg-amber-500/20 text-4xl mb-2 animate-bounce">
              🍢🎉
            </span>
            <h2 className="text-2xl font-black bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
              สรุปผลงานยอดขายไลฟ์สด!
            </h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              ระยะเวลาไลฟ์สดทั้งหมด: <span className="font-mono font-bold text-white">{durationStr}</span>
            </p>
          </div>

          {/* 4 Main Core Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-xs text-amber-300 font-bold block mb-1">ยอดขายปลาหมึก</span>
              <span className="text-2xl font-black font-mono text-amber-300">{stats.totalSkewersSold}</span>
              <span className="text-[10px] text-slate-400 block">ไม้</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs text-emerald-300 font-bold block mb-1">คนดูช่วยย่าง</span>
              <span className="text-2xl font-black font-mono text-emerald-300">{stats.totalSkewersGrilled}</span>
              <span className="text-[10px] text-slate-400 block">ไม้</span>
            </div>

            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
              <span className="text-xs text-rose-300 font-bold block mb-1">ยอดเคาะใจ</span>
              <span className="text-2xl font-black font-mono text-rose-300">{stats.totalLikesCount.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 block">ใจ</span>
            </div>

            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
              <span className="text-xs text-purple-300 font-bold block mb-1">ออเดอร์ทั้งหมด</span>
              <span className="text-2xl font-black font-mono text-purple-300">{stats.totalOrdersCount}</span>
              <span className="text-[10px] text-slate-400 block">บิล</span>
            </div>
          </div>

          {/* MVPs of the Live Session */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
            {/* Top Helper MVP */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-emerald-500/20 text-2xl text-emerald-300">
                👑
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">
                  เชฟใหญ่ MVP ประจำไลฟ์
                </span>
                {topHelper ? (
                  <>
                    <p className="text-sm font-extrabold text-white truncate">
                      @{topHelper.nickname}
                    </p>
                    <p className="text-xs font-mono text-emerald-300 font-semibold">
                      ช่วยย่างไป {topHelper.skewersGrilled} ไม้ 🔥
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-slate-500">- ไม่มีข้อมูล -</p>
                )}
              </div>
            </div>

            {/* Top Buyer VIP */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-950/60 to-slate-900 border border-rose-500/30 flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-rose-500/20 text-2xl text-rose-300">
                💎
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-rose-400 block uppercase tracking-wider">
                  ลูกค้า VIP สายเปย์อันดับ 1
                </span>
                {topBuyer ? (
                  <>
                    <p className="text-sm font-extrabold text-white truncate">
                      @{topBuyer.nickname}
                    </p>
                    <p className="text-xs font-mono text-rose-300 font-semibold">
                      สั่งซื้อไป {topBuyer.skewersOrdered} ไม้ 🍢
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-slate-500">- ไม่มีข้อมูล -</p>
                )}
              </div>
            </div>
          </div>

          {/* Gift Breakdown */}
          <div className="my-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              สรุปจำนวนของขวัญที่ได้รับในไลฟ์นี้
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {(Object.keys(GIFT_DEFINITIONS) as GiftId[]).map((gid) => {
                const def = GIFT_DEFINITIONS[gid];
                const count = stats.giftCountSummary[gid] || 0;
                return (
                  <div key={gid} className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 truncate">
                      <span>{def.icon}</span>
                      <span className="truncate text-slate-300">{def.nameTh}</span>
                    </span>
                    <span className="font-mono font-bold text-amber-300 shrink-0 ml-1">
                      x{count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              ปิดหน้าต่าง
            </button>
            <button
              onClick={() => {
                onRestartSession();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-extrabold shadow-lg flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              เริ่มไลฟ์รอบใหม่!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
