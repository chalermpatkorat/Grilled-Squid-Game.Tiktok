import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Flame,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Radio,
  Trophy,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Heart,
  Package,
  Send,
  Users,
  CheckCircle,
  Play,
  Square,
  AlertCircle,
  Clock,
  RotateCw,
} from 'lucide-react';
import {
  GiftId,
  GIFT_DEFINITIONS,
  LiveAlert,
  OrderItem,
  HelperRecord,
  BuyerRecord,
  LiveSessionStats,
  TikTokUser,
  GrillingSkewer,
} from './types/game';
import { soundService } from './services/soundService';
import { AquariumTank } from './components/AquariumTank';
import { ReadyTray } from './components/ReadyTray';
import { CharcoalGrill } from './components/CharcoalGrill';
import { LiveAlertBanner } from './components/LiveAlertBanner';
import { LiveLeaderboard } from './components/LiveLeaderboard';
import { TikTokGiftGuide } from './components/TikTokGiftGuide';
import { EndLiveSummaryModal } from './components/EndLiveSummaryModal';
import { TikTokConnectModal } from './components/TikTokConnectModal';

const SAMPLE_VIEWERS: TikTokUser[] = [
  { id: 'u1', username: 'ploy_kawaii', nickname: 'น้องพลอยยี่', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'u2', username: 'chef_tum', nickname: 'เชฟตั้ม_กระทะเดือด', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'u3', username: 'namwhan_cute', nickname: 'น้ำหวาน_สายกิน', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'u4', username: 'bank_gamer', nickname: 'พี่แบงค์_สายเปย์', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'u5', username: 'mint_zaza', nickname: 'น้องมิ้นท์_คนสวย', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' },
  { id: 'u6', username: 'jack_squid', nickname: 'แจ็ค_หมึกซิ่ง', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
  { id: 'u7', username: 'aom_am', nickname: 'ออมแอม_แป้งนุ่ม', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { id: 'u8', username: 'ball_korat', nickname: 'บอล_โคราชบ้านเอ๋ง', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
];

export default function App() {
  // TikTok Live Connection State
  const [tiktokUsername, setTiktokUsername] = useState('SquidChef_Official');
  const [isConnected, setIsConnected] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState<'off' | 'slow' | 'normal' | 'rush'>('normal');
  const [wsUrl, setWsUrl] = useState('');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  // Audio Settings (Completely steady screen, no shake)
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isBgmStarted, setIsBgmStarted] = useState(false);

  // Delivery Toast feedback
  const [deliveryToast, setDeliveryToast] = useState<string | null>(null);

  // Game & Store Live State
  const [stats, setStats] = useState<LiveSessionStats>({
    isActive: true,
    startTime: Date.now(),
    readyStock: 25,
    rawSquidsInTank: 120,
    totalSkewersGrilled: 42,
    totalSkewersSold: 38,
    totalOrdersCount: 16,
    totalLikesCount: 1280,
    currentLikesPool: 45,
    giftCountSummary: {
      rose: 12,
      finger_heart: 5,
      perfume: 2,
      donut: 1,
      cap_mustache: 0,
      thumbs_up: 6,
      mini_dino: 2,
      mishka_bear: 0,
      screen_like: 12,
    },
  });

  // Skewers on the Grill with Live Timers (Under 10s per skewer, with flip requirement!)
  const [skewersOnGrill, setSkewersOnGrill] = useState<GrillingSkewer[]>([
    {
      id: 'init-1',
      count: 1,
      sideASeconds: 4,
      sideBSeconds: 4,
      currentSecondsLeft: 4,
      stage: 'grilling_side_a',
      isFlipped: false,
      createdAt: Date.now(),
    },
    {
      id: 'init-2',
      count: 1,
      sideASeconds: 4,
      sideBSeconds: 4,
      currentSecondsLeft: 2,
      stage: 'grilling_side_a',
      isFlipped: false,
      createdAt: Date.now() - 2000,
    },
  ]);

  // Pending Customer Order Queue
  const [pendingOrders, setPendingOrders] = useState<OrderItem[]>([
    {
      id: 'ord-1',
      user: SAMPLE_VIEWERS[0],
      giftId: 'rose',
      skewers: 1,
      status: 'pending',
      timestamp: Date.now() - 8000,
    },
    {
      id: 'ord-2',
      user: SAMPLE_VIEWERS[2],
      giftId: 'finger_heart',
      skewers: 5,
      status: 'pending',
      timestamp: Date.now() - 2000,
    },
  ]);

  // Leaderboard data
  const [helpers, setHelpers] = useState<HelperRecord[]>([
    { userId: 'u2', username: 'chef_tum', nickname: 'เชฟตั้ม_กระทะเดือด', avatar: SAMPLE_VIEWERS[1].avatar, skewersGrilled: 24, lastActive: Date.now() - 5000 },
    { userId: 'u4', username: 'bank_gamer', nickname: 'พี่แบงค์_สายเปย์', avatar: SAMPLE_VIEWERS[3].avatar, skewersGrilled: 20, lastActive: Date.now() - 15000 },
    { userId: 'u6', username: 'jack_squid', nickname: 'แจ็ค_หมึกซิ่ง', avatar: SAMPLE_VIEWERS[5].avatar, skewersGrilled: 12, lastActive: Date.now() - 30000 },
  ]);

  const [buyers, setBuyers] = useState<BuyerRecord[]>([
    { userId: 'u1', username: 'ploy_kawaii', nickname: 'น้องพลอยยี่', avatar: SAMPLE_VIEWERS[0].avatar, skewersOrdered: 18, skewersDelivered: 17, totalCoins: 65, lastActive: Date.now() - 10000 },
    { userId: 'u3', username: 'namwhan_cute', nickname: 'น้ำหวาน_สายกิน', avatar: SAMPLE_VIEWERS[2].avatar, skewersOrdered: 15, skewersDelivered: 10, totalCoins: 45, lastActive: Date.now() - 22000 },
    { userId: 'u5', username: 'mint_zaza', nickname: 'น้องมิ้นท์_คนสวย', avatar: SAMPLE_VIEWERS[4].avatar, skewersOrdered: 10, skewersDelivered: 10, totalCoins: 30, lastActive: Date.now() - 40000 },
  ]);

  // Alert Banner State
  const [currentAlert, setCurrentAlert] = useState<LiveAlert | null>(null);
  const alertTimeoutRef = useRef<any>(null);

  // Live Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (stats.isActive) {
        setElapsedSeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [stats.isActive]);

  // Countdown timer for each skewer on the grill
  useEffect(() => {
    const timer = setInterval(() => {
      setSkewersOnGrill((prev) => {
        if (prev.length === 0) return prev;
        return prev.map((skewer) => {
          if (skewer.stage === 'grilling_side_a') {
            if (skewer.currentSecondsLeft <= 1) {
              return {
                ...skewer,
                stage: 'need_flip',
                currentSecondsLeft: 0,
              };
            }
            return {
              ...skewer,
              currentSecondsLeft: skewer.currentSecondsLeft - 1,
            };
          } else if (skewer.stage === 'grilling_side_b') {
            if (skewer.currentSecondsLeft <= 1) {
              return {
                ...skewer,
                stage: 'cooked',
                currentSecondsLeft: 0,
              };
            }
            return {
              ...skewer,
              currentSecondsLeft: skewer.currentSecondsLeft - 1,
            };
          }
          return skewer;
        });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Sound & Voice Control handlers
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundService.setMuted(next);
  };

  const handleToggleVoice = () => {
    const next = !isVoiceEnabled;
    setIsVoiceEnabled(next);
    soundService.setVoiceEnabled(next);
  };

  const handleToggleBgm = () => {
    if (isBgmStarted) {
      soundService.stopBGM();
      setIsBgmStarted(false);
    } else {
      soundService.startBGM();
      setIsBgmStarted(true);
    }
  };

  // Host feature: เอาปลาหมึกขึ้นเตาเองได้เลย (Manual Player Grilling)
  const handlePutSquidOnGrill = useCallback((count: number) => {
    if (stats.rawSquidsInTank < count) {
      setDeliveryToast(`⚠️ ปลาหมึกสดในตู้ไม่พอ! กดปุ่มรีฟิลในตู้เพื่อเติมปลาหมึกสด`);
      setTimeout(() => setDeliveryToast(null), 3000);
      return;
    }

    soundService.playGrillSizzle();

    setStats((prev) => ({
      ...prev,
      rawSquidsInTank: Math.max(0, prev.rawSquidsInTank - count),
    }));

    const newItems: GrillingSkewer[] = [];
    if (count <= 4) {
      for (let i = 0; i < count; i++) {
        newItems.push({
          id: `skw-${Date.now()}-${Math.random()}-${i}`,
          count: 1,
          sideASeconds: 4,
          sideBSeconds: 4,
          currentSecondsLeft: 4,
          stage: 'grilling_side_a',
          isFlipped: false,
          createdAt: Date.now() + i * 100,
        });
      }
    } else {
      const slots = Math.min(count, 5);
      const perSlot = Math.floor(count / slots);
      const remainder = count % slots;

      for (let i = 0; i < slots; i++) {
        const batchAmount = perSlot + (i === 0 ? remainder : 0);
        newItems.push({
          id: `skw-${Date.now()}-${Math.random()}-${i}`,
          count: batchAmount,
          sideASeconds: 4,
          sideBSeconds: 4,
          currentSecondsLeft: 4,
          stage: 'grilling_side_a',
          isFlipped: false,
          createdAt: Date.now() + i * 100,
        });
      }
    }

    setSkewersOnGrill((prev) => [...prev.slice(-3), ...newItems]);
    setDeliveryToast(`🔥 วางปลาหมึกขึ้นเตาย่าง +${count} ไม้ (รอพลิกใน 4 วินาที)`);
    setTimeout(() => setDeliveryToast(null), 2500);
  }, [stats.rawSquidsInTank]);

  // Flip an individual skewer
  const handleFlipSkewer = useCallback((skewerId: string) => {
    setSkewersOnGrill((prev) =>
      prev.map((s) => {
        if (s.id === skewerId && s.stage === 'need_flip') {
          return {
            ...s,
            isFlipped: true,
            stage: 'grilling_side_b',
            currentSecondsLeft: 4,
          };
        }
        return s;
      })
    );
  }, []);

  // Flip all skewers that need flipping
  const handleFlipAllSkewers = useCallback(() => {
    setSkewersOnGrill((prev) =>
      prev.map((s) => {
        if (s.stage === 'need_flip') {
          return {
            ...s,
            isFlipped: true,
            stage: 'grilling_side_b',
            currentSecondsLeft: 4,
          };
        }
        return s;
      })
    );
    setDeliveryToast('🔄 พลิกปลาหมึกย่างทุกไม้เรียบร้อย! ย่างอีก 4 วิ สุกหอมฉุย 🔥');
    setTimeout(() => setDeliveryToast(null), 2500);
  }, []);

  // Collect individual cooked skewer to Ready Tray
  const handleCollectSkewer = useCallback((skewerId: string) => {
    const skewer = skewersOnGrill.find((s) => s.id === skewerId);
    if (!skewer) return;

    setStats((prev) => ({
      ...prev,
      readyStock: prev.readyStock + skewer.count,
      totalSkewersGrilled: prev.totalSkewersGrilled + skewer.count,
    }));

    setSkewersOnGrill((prev) => prev.filter((s) => s.id !== skewerId));
    setDeliveryToast(`🍢 ย้ายปลาหมึกย่างสุกแล้ว +${skewer.count} ไม้ ขึ้นถาดพร้อมขาย!`);
    setTimeout(() => setDeliveryToast(null), 2000);
  }, [skewersOnGrill]);

  // Collect all cooked skewers to Ready Tray
  const handleCollectAllCooked = useCallback(() => {
    const cookedItems = skewersOnGrill.filter((s) => s.stage === 'cooked');
    if (cookedItems.length === 0) return;

    const totalCollected = cookedItems.reduce((acc, curr) => acc + curr.count, 0);

    setStats((prev) => ({
      ...prev,
      readyStock: prev.readyStock + totalCollected,
      totalSkewersGrilled: prev.totalSkewersGrilled + totalCollected,
    }));

    setSkewersOnGrill((prev) => prev.filter((s) => s.stage !== 'cooked'));
    setDeliveryToast(`🍢 เก็บปลาหมึกย่างสุกแล้วทั้งหมด +${totalCollected} ไม้ ขึ้นถาดพร้อมขาย! ✨`);
    setTimeout(() => setDeliveryToast(null), 2500);
  }, [skewersOnGrill]);

  // Feature: เอาปลาหมึกส่งให้ลูกค้า (Serve & Deliver to Customers)
  const handleServeOrder = useCallback((orderId: string) => {
    const order = pendingOrders.find((o) => o.id === orderId);
    if (!order) return;

    if (stats.readyStock < order.skewers) {
      setDeliveryToast(`⚠️ ปลาหมึกย่างไม่พอส่ง! มี ${stats.readyStock} ไม้ แต่ลูกค้าสั่ง ${order.skewers} ไม้ (กดปุ่มย่างเพิ่มก่อนนะ)`);
      setTimeout(() => setDeliveryToast(null), 3500);
      return;
    }

    setStats((prev) => ({
      ...prev,
      readyStock: prev.readyStock - order.skewers,
      totalSkewersSold: prev.totalSkewersSold + order.skewers,
    }));

    setPendingOrders((prev) => prev.filter((o) => o.id !== orderId));

    soundService.playOrderChime();
    setDeliveryToast(`📦 ส่งปลาหมึกย่าง ${order.skewers} ไม้ ให้ @${order.user.nickname} สำเร็จแล้ว! ขอบคุณค่ะ 🎉`);
    setTimeout(() => setDeliveryToast(null), 3000);

    setBuyers((prev) =>
      prev.map((b) =>
        b.userId === order.user.id
          ? { ...b, skewersDelivered: b.skewersDelivered + order.skewers }
          : b
      )
    );
  }, [pendingOrders, stats.readyStock]);

  // Deliver All Pending Orders
  const handleServeAllOrders = useCallback(() => {
    if (pendingOrders.length === 0) return;

    let availableStock = stats.readyStock;
    let fulfilledCount = 0;
    let skewersDelivered = 0;
    const remainingOrders: OrderItem[] = [];

    for (const order of pendingOrders) {
      if (availableStock >= order.skewers) {
        availableStock -= order.skewers;
        fulfilledCount++;
        skewersDelivered += order.skewers;
      } else {
        remainingOrders.push(order);
      }
    }

    if (fulfilledCount === 0) {
      setDeliveryToast(`⚠️ ปลาหมึกย่างบนถาดไม่พอส่ง! กรุณากดเอาหมึกขึ้นเตาย่างก่อนนะ`);
      setTimeout(() => setDeliveryToast(null), 3000);
      return;
    }

    setStats((prev) => ({
      ...prev,
      readyStock: availableStock,
      totalSkewersSold: prev.totalSkewersSold + skewersDelivered,
    }));

    setPendingOrders(remainingOrders);
    soundService.playOrderChime();
    setDeliveryToast(`📦 ส่งปลาหมึกย่างให้ลูกค้าสำเร็จ ${fulfilledCount} ออเดอร์ (รวม ${skewersDelivered} ไม้)! 🎉`);
    setTimeout(() => setDeliveryToast(null), 3200);
  }, [pendingOrders, stats.readyStock]);

  // Process incoming Gift Event (Steady screen, no shaking)
  const processGiftEvent = useCallback(
    (giftId: GiftId, sender?: TikTokUser, overrideSkewers?: number) => {
      const def = GIFT_DEFINITIONS[giftId];
      if (!def) return;

      const user = sender || SAMPLE_VIEWERS[Math.floor(Math.random() * SAMPLE_VIEWERS.length)];
      let skewersAmount = overrideSkewers || def.skewers;
      let isJackpot = false;

      // Special rule: หมวกกับหนวด 1 อัน = สุ่มสั่ง 20 - 100 ไม้ (Jackpot!)
      if (def.isJackpot) {
        skewersAmount = Math.floor(Math.random() * (def.maxSkewers! - def.minSkewers! + 1)) + def.minSkewers!;
        isJackpot = true;
      }

      // 1. Create and show alert banner with sender's avatar
      const alert: LiveAlert = {
        id: `alert-${Date.now()}-${Math.random()}`,
        user,
        gift: def,
        skewers: skewersAmount,
        isJackpot,
        timestamp: Date.now(),
      };

      setCurrentAlert(alert);
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
      alertTimeoutRef.current = setTimeout(() => {
        setCurrentAlert(null);
      }, 4200);

      // 2. Play Sound, TTS
      if (def.category === 'order') {
        if (isJackpot) {
          soundService.playJackpotFlourish();
        } else {
          soundService.playOrderChime();
        }
        soundService.speakOrder(user.nickname, skewersAmount, def.nameTh);

        const newOrder: OrderItem = {
          id: `ord-${Date.now()}-${Math.random()}`,
          user,
          giftId,
          skewers: skewersAmount,
          isJackpot,
          status: 'pending',
          timestamp: Date.now(),
        };

        setPendingOrders((prev) => [newOrder, ...prev.slice(0, 9)]);

        setStats((prev) => ({
          ...prev,
          totalOrdersCount: prev.totalOrdersCount + 1,
          giftCountSummary: {
            ...prev.giftCountSummary,
            [giftId]: (prev.giftCountSummary[giftId] || 0) + 1,
          },
        }));

        setBuyers((prev) => {
          const existing = prev.find((b) => b.userId === user.id);
          if (existing) {
            return prev.map((b) =>
              b.userId === user.id
                ? {
                    ...b,
                    skewersOrdered: b.skewersOrdered + skewersAmount,
                    totalCoins: b.totalCoins + def.coins,
                    lastActive: Date.now(),
                  }
                : b
            );
          } else {
            return [
              ...prev,
              {
                userId: user.id,
                username: user.username,
                nickname: user.nickname,
                avatar: user.avatar,
                skewersOrdered: skewersAmount,
                skewersDelivered: 0,
                totalCoins: def.coins,
                lastActive: Date.now(),
              },
            ];
          }
        });
      } else {
        // def.category === 'grill_help'
        if (giftId === 'mishka_bear') {
          soundService.playJackpotFlourish();
        } else {
          soundService.playHelperChime();
        }
        soundService.speakHelper(user.nickname, skewersAmount, def.nameTh);

        // Put squids on the grill with live timers for host to flip!
        handlePutSquidOnGrill(skewersAmount);

        setStats((prev) => ({
          ...prev,
          giftCountSummary: {
            ...prev.giftCountSummary,
            [giftId]: (prev.giftCountSummary[giftId] || 0) + 1,
          },
        }));

        // Update Helper Leaderboard (Second-by-second)
        setHelpers((prev) => {
          const existing = prev.find((h) => h.userId === user.id);
          if (existing) {
            return prev.map((h) =>
              h.userId === user.id
                ? {
                    ...h,
                    skewersGrilled: h.skewersGrilled + skewersAmount,
                    lastActive: Date.now(),
                  }
                : h
            );
          } else {
            return [
              ...prev,
              {
                userId: user.id,
                username: user.username,
                nickname: user.nickname,
                avatar: user.avatar,
                skewersGrilled: skewersAmount,
                lastActive: Date.now(),
              },
            ];
          }
        });
      }
    },
    [handlePutSquidOnGrill]
  );

  // Handle Screen Like (เคาะจอเคาะใจ 100 ครั้ง = ช่วยย่าง 1 ไม้)
  const handleTapLike = useCallback(() => {
    setStats((prev) => {
      const nextPool = prev.currentLikesPool + 1;
      const totalLikes = prev.totalLikesCount + 1;

      if (nextPool >= 100) {
        setTimeout(() => {
          processGiftEvent('screen_like', {
            id: 'u-heart',
            username: 'tiktok_viewer',
            nickname: 'คนดูเคาะใจครบ 100!',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          }, 1);
        }, 100);

        return {
          ...prev,
          totalLikesCount: totalLikes,
          currentLikesPool: 0,
        };
      }

      return {
        ...prev,
        totalLikesCount: totalLikes,
        currentLikesPool: nextPool,
      };
    });
  }, [processGiftEvent]);

  // Simulation Bot Engine: Emits TikTok gifts based on speed setting
  useEffect(() => {
    if (simulationSpeed === 'off' || !stats.isActive) return;

    const intervalMs =
      simulationSpeed === 'rush' ? 2200 : simulationSpeed === 'normal' ? 5500 : 12000;

    const availableGifts: GiftId[] = [
      'rose',
      'rose',
      'rose',
      'finger_heart',
      'finger_heart',
      'thumbs_up',
      'thumbs_up',
      'mini_dino',
      'perfume',
      'donut',
      'cap_mustache',
      'mishka_bear',
    ];

    const timer = setInterval(() => {
      const randomGift = availableGifts[Math.floor(Math.random() * availableGifts.length)];
      const randomUser = SAMPLE_VIEWERS[Math.floor(Math.random() * SAMPLE_VIEWERS.length)];
      processGiftEvent(randomGift, randomUser);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [simulationSpeed, stats.isActive, processGiftEvent]);

  // Optional external WebSocket listener for TikFinity / TikTokLive Connector
  useEffect(() => {
    if (!wsUrl || !isConnected) return;
    let ws: WebSocket;
    try {
      ws = new WebSocket(wsUrl);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'gift' || data.event === 'gift') {
            const giftName = (data.giftName || data.name || '').toLowerCase();
            let matchedId: GiftId = 'rose';

            if (giftName.includes('rose') || giftName.includes('กุหลาบ')) matchedId = 'rose';
            else if (giftName.includes('heart') || giftName.includes('หัวใจ')) matchedId = 'finger_heart';
            else if (giftName.includes('perfume') || giftName.includes('น้ำหอม')) matchedId = 'perfume';
            else if (giftName.includes('donut') || giftName.includes('โดนัท')) matchedId = 'donut';
            else if (giftName.includes('cap') || giftName.includes('หมวก')) matchedId = 'cap_mustache';
            else if (giftName.includes('thumbs') || giftName.includes('เยี่ยม')) matchedId = 'thumbs_up';
            else if (giftName.includes('dino') || giftName.includes('ไดโนเสาร์')) matchedId = 'mini_dino';
            else if (giftName.includes('mishka') || giftName.includes('หมี')) matchedId = 'mishka_bear';

            const user: TikTokUser = {
              id: data.userId || String(Date.now()),
              username: data.uniqueId || data.username || 'tiktok_fan',
              nickname: data.nickname || data.username || 'เพื่อนในไลฟ์',
              avatar: data.profilePictureUrl || SAMPLE_VIEWERS[0].avatar,
            };

            processGiftEvent(matchedId, user);
          } else if (data.type === 'like' || data.event === 'like') {
            const count = data.likeCount || 1;
            for (let i = 0; i < Math.min(count, 5); i++) {
              handleTapLike();
            }
          }
        } catch {
          // ignore parsing error
        }
      };
    } catch {
      // ws safety
    }

    return () => {
      if (ws) ws.close();
    };
  }, [wsUrl, isConnected, processGiftEvent, handleTapLike]);

  // End Live Session handler
  const handleEndLive = () => {
    setStats((prev) => ({
      ...prev,
      isActive: false,
      endTime: Date.now(),
    }));
    setIsSummaryModalOpen(true);
  };

  const handleRestartSession = () => {
    setStats({
      isActive: true,
      startTime: Date.now(),
      readyStock: 20,
      rawSquidsInTank: 100,
      totalSkewersGrilled: 0,
      totalSkewersSold: 0,
      totalOrdersCount: 0,
      totalLikesCount: 0,
      currentLikesPool: 0,
      giftCountSummary: {
        rose: 0,
        finger_heart: 0,
        perfume: 0,
        donut: 0,
        cap_mustache: 0,
        thumbs_up: 0,
        mini_dino: 0,
        mishka_bear: 0,
        screen_like: 0,
      },
    });
    setSkewersOnGrill([]);
    setPendingOrders([]);
    setHelpers([]);
    setBuyers([]);
    setElapsedSeconds(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Kanit',sans-serif]">
      {/* Real-time Alert Popup Banner with Sender Profile (Steady) */}
      <LiveAlertBanner currentAlert={currentAlert} onDismiss={() => setCurrentAlert(null)} />

      {/* Floating Delivery Feedback Toast */}
      {deliveryToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900/95 border border-amber-400 text-amber-200 text-xs font-bold shadow-2xl animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <span>{deliveryToast}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-lg">
        {/* Left: Branding & Shop Name */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center text-xl shadow-lg shadow-orange-500/20 border border-white/20">
              🦑
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border border-white"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                ร้านปลาหมึกย่างซอสเด็ด 3D
                <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  TikTok Live
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>@{tiktokUsername}</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/70 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  {isConnected ? 'เชื่อมต่อเรียลไทม์' : 'ออฟไลน์'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Center: Live Timer & Live skewer ticker */}
        <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-black text-rose-400 font-mono">
              LIVE {formatDuration(elapsedSeconds)}
            </span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5 text-xs text-amber-300">
            <span>🍢 ขายแล้ว:</span>
            <span className="font-mono font-black text-white text-sm">
              {stats.totalSkewersSold}
            </span>
            <span>ไม้</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5 text-xs text-emerald-300">
            <span>👨‍🍳 คนดูช่วยย่าง:</span>
            <span className="font-mono font-black text-white text-sm">
              {stats.totalSkewersGrilled}
            </span>
            <span>ไม้</span>
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio Controls */}
          <button
            onClick={handleToggleBgm}
            title={isBgmStarted ? 'ปิดเพลงคลอ' : 'เปิดเพลงคลอน่ารักๆ'}
            className={`p-2 rounded-xl text-xs font-bold border transition-all ${
              isBgmStarted
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            🎵 เพลงคลอ {isBgmStarted ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={handleToggleVoice}
            title={isVoiceEnabled ? 'ปิดเสียงพูดอ่านออเดอร์' : 'เปิดเสียงพูดอ่านออเดอร์'}
            className={`p-2 rounded-xl text-xs font-bold border transition-all ${
              isVoiceEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {isVoiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={handleToggleMute}
            title={isMuted ? 'เปิดเสียงเอฟเฟกต์' : 'ปิดเสียงเอฟเฟกต์'}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* TikTok Connection Settings */}
          <button
            onClick={() => setIsConnectModalOpen(true)}
            title="ตั้งค่า TikTok Live & บอทจำลองคนดู"
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 hover:bg-slate-700 transition-all"
          >
            <Radio className="w-4 h-4" />
          </button>

          {/* Start / End Live Session Button */}
          {stats.isActive ? (
            <button
              onClick={handleEndLive}
              className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black shadow-lg flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">ปิดไลฟ์ &</span> สรุปยอด
            </button>
          ) : (
            <button
              onClick={handleRestartSession}
              className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-black shadow-lg flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              เริ่มไลฟ์ใหม่
            </button>
          )}
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 space-y-4">
        {/* Top Status & Store Ambiance Banner */}
        <div className="relative rounded-3xl p-1 bg-gradient-to-r from-amber-500/30 via-orange-600/20 to-rose-600/30 border border-amber-400/20 shadow-xl overflow-hidden">
          <div className="rounded-[22px] bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏮</span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-extrabold text-white">
                    ยินดีต้อนรับสู่ร้านปลาหมึกย่างไลฟ์สด TikTok!
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                    กราฟิกการ์ตูน 3D สดใส
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  ย่างปลาหมึกบนเตา <span className="text-amber-300 font-bold">รอพลิกใน 4 วินาที (สุกไม่เกิน 10 วิ)</span> พร้อมนาฬิกาแจ้งเตือนบนแต่ละไม้!
                </p>
              </div>
            </div>

            {/* Quick Live Stats Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-1.5">
                <span className="text-rose-400">❤️ เคาะใจ:</span>
                <span className="font-mono font-bold text-white">
                  {stats.totalLikesCount.toLocaleString()}
                </span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-1.5">
                <span className="text-emerald-400">👨‍🍳 ผู้ช่วยย่าง:</span>
                <span className="font-mono font-bold text-white">{helpers.length} คน</span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-1.5">
                <span className="text-amber-400">📦 ออเดอร์รอส่ง:</span>
                <span className="font-mono font-bold text-amber-300">{pendingOrders.length} บิล</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Column Interactive Shop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Column 1: ตู้ปลาหมึกสดว่ายน้ำเล่น (Fresh Squid Aquarium Tank) */}
          <div className="lg:col-span-4 flex flex-col">
            <AquariumTank
              squidCount={stats.rawSquidsInTank}
              onTapSquid={() => {}}
              onRefillTank={() => {
                setStats((prev) => ({
                  ...prev,
                  rawSquidsInTank: prev.rawSquidsInTank + 30,
                }));
                soundService.playLikePop();
              }}
              onPutSquidOnGrill={handlePutSquidOnGrill}
              isGrillingActive={skewersOnGrill.length > 0}
            />
          </div>

          {/* Column 2: เตาย่างถ่านไม้พร้อมฟีเจอร์พลิกไม้ & ถาดปลาหมึกย่างพร้อมขาย */}
          <div className="lg:col-span-4 flex flex-col space-y-3">
            {/* 1. Charcoal Grill with Interactive Skewer Flipping & Clocks */}
            <CharcoalGrill
              skewersOnGrill={skewersOnGrill}
              onFlipSkewer={handleFlipSkewer}
              onFlipAllSkewers={handleFlipAllSkewers}
              onCollectSkewer={handleCollectSkewer}
              onCollectAllCooked={handleCollectAllCooked}
              onFanFlames={() => {}}
              onManualGrill={handlePutSquidOnGrill}
            />

            {/* 2. Ready Skewers Display Tray + Feature ส่งปลาหมึกให้ลูกค้า */}
            <ReadyTray
              readyCount={stats.readyStock}
              pendingOrders={pendingOrders}
              onServeOrder={handleServeOrder}
              onServeAllOrders={handleServeAllOrders}
              onQuickServe={() => {
                if (stats.readyStock > 0) {
                  soundService.playOrderChime();
                  setStats((prev) => ({
                    ...prev,
                    readyStock: Math.max(0, prev.readyStock - 1),
                    totalSkewersSold: prev.totalSkewersSold + 1,
                  }));
                  setDeliveryToast('🍢 ขายปลาหมึกย่างหน้าร้านสำเร็จ 1 ไม้!');
                  setTimeout(() => setDeliveryToast(null), 2000);
                }
              }}
            />
          </div>

          {/* Column 3: กระดานผู้นำเรียลไทม์ (Real-time Leaderboard) & คิวออเดอร์ */}
          <div className="lg:col-span-4 flex flex-col space-y-3">
            {/* Pending Customer Orders Queue Box */}
            {pendingOrders.length > 0 && (
              <div className="rounded-2xl p-3 bg-slate-900/90 border border-rose-500/30 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-rose-400" />
                    ออเดอร์ลูกค้าที่รอรับปลาหมึก ({pendingOrders.length})
                  </span>
                  <button
                    onClick={handleServeAllOrders}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    ส่งทั้งหมด 🚀
                  </button>
                </div>

                <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {pendingOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-1.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={ord.user.avatar}
                          alt={ord.user.nickname}
                          className="w-6 h-6 rounded-full object-cover border border-slate-700"
                        />
                        <span className="truncate text-white font-semibold max-w-[100px]">
                          @{ord.user.nickname}
                        </span>
                        <span className="text-amber-300 font-mono font-bold">
                          {ord.skewers} ไม้
                        </span>
                      </div>

                      <button
                        onClick={() => handleServeOrder(ord.id)}
                        className="px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow active:scale-95 transition-transform flex items-center gap-1"
                      >
                        <Package className="w-3 h-3" />
                        ส่งให้ลูกค้า
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real-time Leaderboard */}
            <LiveLeaderboard
              helpers={helpers}
              buyers={buyers}
              stats={stats}
            />
          </div>
        </div>

        {/* Bottom Section: TikTok Gift Guide & Interactive Gift Clicker */}
        <div className="mt-4">
          <TikTokGiftGuide
            onTriggerGift={(giftId) => processGiftEvent(giftId)}
            onTapLike={handleTapLike}
            currentLikesPool={stats.currentLikesPool}
          />
        </div>
      </main>

      {/* Footer info */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 px-4 py-3 text-center text-xs text-slate-500">
        <p>
          🍢 ร้านปลาหมึกย่าง TikTok Live Interactive | ระบบย่างสด พลิกปลาหมึก นาฬิกาแจ้งเตือน และกระดานผู้นำเรียลไทม์
        </p>
      </footer>

      {/* TikTok Connection & Simulation Modal */}
      <TikTokConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        tiktokUsername={tiktokUsername}
        setTiktokUsername={setTiktokUsername}
        isConnected={isConnected}
        setIsConnected={setIsConnected}
        simulationSpeed={simulationSpeed}
        setSimulationSpeed={setSimulationSpeed}
        wsUrl={wsUrl}
        setWsUrl={setWsUrl}
      />

      {/* End Live Summary Modal */}
      <EndLiveSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        onRestartSession={handleRestartSession}
        stats={stats}
        helpers={helpers}
        buyers={buyers}
      />
    </div>
  );
}
