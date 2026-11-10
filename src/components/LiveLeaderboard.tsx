import React, { useState } from 'react';
import { Crown, Flame, Trophy, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { HelperRecord, BuyerRecord, LiveSessionStats } from '../types/game';

interface LiveLeaderboardProps {
  helpers: HelperRecord[];
  buyers: BuyerRecord[];
  stats: LiveSessionStats;
}

export const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({
  helpers,
  buyers,
  stats,
}) => {
  const [tab, setTab] = useState<'helpers' | 'buyers' | 'sales'>('helpers');

  // Sort helpers descending by skewers grilled (second-by-second live update)
  const sortedHelpers = [...helpers].sort((a, b) => b.skewersGrilled - a.skewersGrilled);

  // Sort buyers descending by skewers ordered
  const sortedBuyers = [...buyers].sort((a, b) => b.skewersOrdered - a.skewersOrdered);

  return (
    <div className="w-full rounded-3xl p-1 bg-gradient-to-b from-indigo-500/40 via-purple-600/30 to-slate-900 border border-purple-400/30 shadow-[0_12px_28px_rgba(99,102,241,0.2)]">
      <div className="rounded-[22px] bg-slate-950/90 backdrop-blur-md p-3.5 flex flex-col h-full">
        {/* Header with Live Ticker */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-full bg-yellow-400/20 text-yellow-300">
              <Trophy className="w-4 h-4" />
            </span>
            <span className="font-extrabold text-sm text-yellow-300 tracking-wide">
              กระดานผู้นำเรียลไทม์ 🏆
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            อัปเดตวินาทีต่อวินาที
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 my-2.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setTab('helpers')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
              tab === 'helpers'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            ผู้ช่วยย่าง
          </button>

          <button
            onClick={() => setTab('buyers')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
              tab === 'buyers'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            สายเปย์
          </button>

          <button
            onClick={() => setTab('sales')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
              tab === 'sales'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            ยอดขายรวม
          </button>
        </div>

        {/* Tab 1: Top Grill Helpers */}
        {tab === 'helpers' && (
          <div className="flex-1 flex flex-col justify-between space-y-2">
            <div className="text-[11px] text-emerald-300 font-semibold flex items-center justify-between px-1">
              <span>อันดับยอดช่วยย่าง (คนขยันประจำไลฟ์)</span>
              <span>รวม {sortedHelpers.length} คน</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {sortedHelpers.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  ยังไม่มีคนช่วยย่าง ส่งของขวัญมาเป็นอันดับ 1 เลย! 🔥
                </div>
              ) : (
                sortedHelpers.slice(0, 8).map((helper, index) => {
                  const isTop1 = index === 0;
                  const isTop2 = index === 1;
                  const isTop3 = index === 2;

                  return (
                    <div
                      key={helper.userId}
                      className={`flex items-center justify-between p-2 rounded-xl transition-transform hover:scale-[1.01] ${
                        isTop1
                          ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent border border-yellow-400/40'
                          : isTop2
                          ? 'bg-slate-800/80 border border-slate-700/60'
                          : isTop3
                          ? 'bg-slate-800/50 border border-slate-700/40'
                          : 'bg-slate-900/40 border border-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Rank Badge */}
                        <div className="w-6 text-center font-black text-xs">
                          {isTop1 ? (
                            <span className="text-base text-yellow-400 drop-shadow">👑</span>
                          ) : isTop2 ? (
                            <span className="text-slate-300 font-extrabold">🥈</span>
                          ) : isTop3 ? (
                            <span className="text-amber-600 font-extrabold">🥉</span>
                          ) : (
                            <span className="text-slate-400 font-mono">#{index + 1}</span>
                          )}
                        </div>

                        {/* Avatar */}
                        <img
                          src={helper.avatar}
                          alt={helper.nickname}
                          className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                        />

                        {/* Name & Title */}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate max-w-[110px]">
                            {helper.nickname}
                          </p>
                          <p className="text-[10px] text-emerald-400 font-medium">
                            {isTop1 ? '🔥 เชฟใหญ่ MVP' : '👨‍🍳 ผู้ช่วยย่าง'}
                          </p>
                        </div>
                      </div>

                      {/* Skewers Grilled Count */}
                      <div className="text-right shrink-0">
                        <span className="text-sm font-black font-mono text-emerald-300">
                          {helper.skewersGrilled}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">ไม้</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Top Squid Buyers */}
        {tab === 'buyers' && (
          <div className="flex-1 flex flex-col justify-between space-y-2">
            <div className="text-[11px] text-rose-300 font-semibold flex items-center justify-between px-1">
              <span>อันดับยอดสั่งซื้อ (ลูกค้าสายเปย์)</span>
              <span>รวม {sortedBuyers.length} คน</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {sortedBuyers.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  ยังไม่มีออเดอร์ ส่งของขวัญมาสั่งปลาหมึกย่างเลย! 🍢
                </div>
              ) : (
                sortedBuyers.slice(0, 8).map((buyer, index) => {
                  const isTop1 = index === 0;

                  return (
                    <div
                      key={buyer.userId}
                      className={`flex items-center justify-between p-2 rounded-xl ${
                        isTop1
                          ? 'bg-gradient-to-r from-rose-500/20 via-pink-500/10 to-transparent border border-rose-400/40'
                          : 'bg-slate-900/50 border border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 text-center font-black text-xs">
                          {isTop1 ? '💎' : `#${index + 1}`}
                        </div>

                        <img
                          src={buyer.avatar}
                          alt={buyer.nickname}
                          className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                        />

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate max-w-[110px]">
                            {buyer.nickname}
                          </p>
                          <p className="text-[10px] text-rose-400 font-medium">
                            {isTop1 ? '🌟 VIP ลูกค้าประจำ' : 'ลูกค้าผู้มีอุปการคุณ'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black font-mono text-rose-300">
                          {buyer.skewersOrdered}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">ไม้</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Live Sales Dashboard */}
        {tab === 'sales' && (
          <div className="flex-1 flex flex-col justify-between space-y-2 py-1">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <span className="text-[10px] text-amber-300 font-bold block">
                  🍢 ยอดขายรวมทั้งไลฟ์
                </span>
                <span className="text-2xl font-black font-mono text-amber-300 drop-shadow">
                  {stats.totalSkewersSold}
                </span>
                <span className="text-[10px] text-amber-200/80 block">ไม้เสิร์ฟแล้ว</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <span className="text-[10px] text-emerald-300 font-bold block">
                  👨‍🍳 ยอดช่วยย่างรวม
                </span>
                <span className="text-2xl font-black font-mono text-emerald-300 drop-shadow">
                  {stats.totalSkewersGrilled}
                </span>
                <span className="text-[10px] text-emerald-200/80 block">ไม้จากคนดู</span>
              </div>

              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                <span className="text-[10px] text-red-300 font-bold block">
                  ❤️ เคาะจอเคาะใจรวม
                </span>
                <span className="text-xl font-black font-mono text-rose-300">
                  {stats.totalLikesCount.toLocaleString()}
                </span>
                <span className="text-[10px] text-red-300/80 block">ครั้ง</span>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                <span className="text-[10px] text-purple-300 font-bold block">
                  📦 ออเดอร์ทั้งหมด
                </span>
                <span className="text-xl font-black font-mono text-purple-300">
                  {stats.totalOrdersCount}
                </span>
                <span className="text-[10px] text-purple-300/80 block">รายการ</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                สต็อกรอขายบนถาดขณะนี้:
              </span>
              <span className="font-bold text-amber-300 text-xs font-mono">
                {stats.readyStock} ไม้
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
