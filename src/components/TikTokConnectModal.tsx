import React, { useState } from 'react';
import { Wifi, Radio, Zap, Settings, Check, HelpCircle, X } from 'lucide-react';

interface TikTokConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiktokUsername: string;
  setTiktokUsername: (username: string) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  simulationSpeed: 'off' | 'slow' | 'normal' | 'rush';
  setSimulationSpeed: (speed: 'off' | 'slow' | 'normal' | 'rush') => void;
  wsUrl: string;
  setWsUrl: (url: string) => void;
}

export const TikTokConnectModal: React.FC<TikTokConnectModalProps> = ({
  isOpen,
  onClose,
  tiktokUsername,
  setTiktokUsername,
  isConnected,
  setIsConnected,
  simulationSpeed,
  setSimulationSpeed,
  wsUrl,
  setWsUrl,
}) => {
  const [localUser, setLocalUser] = useState(tiktokUsername);
  const [localWs, setLocalWs] = useState(wsUrl);

  if (!isOpen) return null;

  const handleSaveAndConnect = () => {
    setTiktokUsername(localUser.trim() || 'SquidChef_Live');
    setWsUrl(localWs.trim());
    setIsConnected(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl p-1 bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 shadow-2xl">
        <div className="rounded-[22px] bg-slate-950 p-5 md:p-6 text-white max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                เชื่อมต่อ TikTok Live เรียลไทม์
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-600 text-white font-extrabold animate-pulse">
                  LIVE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                ตั้งค่าบัญชี TikTok และระบบรับของขวัญอัตโนมัติ
              </p>
            </div>
          </div>

          <div className="space-y-4 my-4 text-xs">
            {/* Input 1: TikTok Username */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                ชื่อบัญชี TikTok ของคุณ (TikTok Username):
              </label>
              <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 focus-within:border-cyan-400">
                <span className="text-cyan-400 font-bold mr-1">@</span>
                <input
                  type="text"
                  value={localUser}
                  onChange={(e) => setLocalUser(e.target.value)}
                  placeholder="เช่น somchai_squid หรือ aom_live"
                  className="bg-transparent text-white w-full outline-none font-medium placeholder-slate-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                ระบบจะใช้ชื่อบัญชีนี้แสดงสถานะและลิงก์กับเซสชันไลฟ์สด
              </p>
            </div>

            {/* Simulation / Crowd Traffic Speed */}
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <label className="block text-white font-bold mb-1.5 flex items-center justify-between">
                <span>🤖 โหมดจำลองของขวัญอัตโนมัติ (Live Simulation):</span>
                <span className="text-[10px] text-cyan-400">เหมาะสำหรับซ้อมหรือขึ้นจอ OBS</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-2">
                {[
                  { id: 'off', label: 'ปิด (กดเอง)', desc: 'ส่งผ่านปุ่ม' },
                  { id: 'slow', label: 'ชิลๆ (12s)', desc: 'ของขวัญเรื่อยๆ' },
                  { id: 'normal', label: 'ปกติ (5s)', desc: 'คนดูสม่ำเสมอ' },
                  { id: 'rush', label: 'แน่นร้าน (2s)', desc: 'ของขวัญถล่มทลาย!' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSimulationSpeed(s.id as any)}
                    className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${
                      simulationSpeed === s.id
                        ? 'bg-gradient-to-b from-cyan-600 to-blue-700 border-cyan-300 text-white font-extrabold shadow-md'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xs">{s.label}</span>
                    <span className="text-[10px] opacity-75">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced: Optional WebSocket URL for TikFinity / TikTokLive Connector */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                การเชื่อมต่อ WebSocket ภายนอก (อุปกรณ์เสริม):
              </label>
              <input
                type="text"
                value={localWs}
                onChange={(e) => setLocalWs(e.target.value)}
                placeholder="ws://localhost:21213 (TikFinity หรือ TikTokLiveConnector)"
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-slate-300 outline-none text-xs font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                หากใช้ TikFinity หรือ Node TikTokLiveConnector ให้ใส่ URL เพื่อรับอีเวนต์ของขวัญจริง
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                setIsConnected(false);
                onClose();
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
            >
              ยกเลิกการเชื่อมต่อ
            </button>

            <button
              onClick={handleSaveAndConnect}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-pink-500 to-amber-400 hover:brightness-110 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Check className="w-4 h-4" />
              บันทึกและเชื่อมต่อไลฟ์สด!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
