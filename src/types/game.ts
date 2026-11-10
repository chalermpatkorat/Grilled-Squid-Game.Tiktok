export type GiftId = 
  | 'rose' 
  | 'finger_heart' 
  | 'perfume' 
  | 'donut' 
  | 'cap_mustache' 
  | 'thumbs_up' 
  | 'mini_dino' 
  | 'mishka_bear' 
  | 'screen_like';

export type GiftCategory = 'order' | 'grill_help';

export interface GiftDefinition {
  id: GiftId;
  nameTh: string;
  category: GiftCategory;
  coins: number;
  skewers: number;
  isJackpot?: boolean;
  minSkewers?: number;
  maxSkewers?: number;
  icon: string;
  descriptionTh: string;
  badgeColor: string;
}

export const GIFT_DEFINITIONS: Record<GiftId, GiftDefinition> = {
  rose: {
    id: 'rose',
    nameTh: 'ดอกกุหลาบ',
    category: 'order',
    coins: 1,
    skewers: 1,
    icon: '🌹',
    descriptionTh: 'สั่งปลาหมึกย่าง 1 ไม้',
    badgeColor: 'from-rose-500 to-pink-600',
  },
  finger_heart: {
    id: 'finger_heart',
    nameTh: 'หัวใจนิ้ว',
    category: 'order',
    coins: 5,
    skewers: 5,
    icon: '🫰',
    descriptionTh: 'สั่งปลาหมึกย่าง 5 ไม้',
    badgeColor: 'from-amber-400 to-orange-500',
  },
  perfume: {
    id: 'perfume',
    nameTh: 'น้ำหอม',
    category: 'order',
    coins: 20,
    skewers: 10,
    icon: '🧴',
    descriptionTh: 'สั่งปลาหมึกย่าง 10 ไม้',
    badgeColor: 'from-purple-500 to-indigo-600',
  },
  donut: {
    id: 'donut',
    nameTh: 'โดนัท',
    category: 'order',
    coins: 30,
    skewers: 20,
    icon: '🍩',
    descriptionTh: 'สั่งปลาหมึกย่าง 20 ไม้',
    badgeColor: 'from-amber-500 to-pink-500',
  },
  cap_mustache: {
    id: 'cap_mustache',
    nameTh: 'หมวกกับหนวด',
    category: 'order',
    coins: 99,
    skewers: 50,
    isJackpot: true,
    minSkewers: 20,
    maxSkewers: 100,
    icon: '🎩🥸',
    descriptionTh: 'สุ่มสั่ง 20 - 100 ไม้ (Jackpot!)',
    badgeColor: 'from-yellow-400 via-amber-500 to-red-500',
  },
  thumbs_up: {
    id: 'thumbs_up',
    nameTh: 'เยี่ยมสุดๆ',
    category: 'grill_help',
    coins: 2,
    skewers: 2,
    icon: '👍✨',
    descriptionTh: 'ช่วยย่าง 2 ไม้',
    badgeColor: 'from-emerald-400 to-teal-600',
  },
  mini_dino: {
    id: 'mini_dino',
    nameTh: 'ไดโนเสาร์จิ๋ว',
    category: 'grill_help',
    coins: 10,
    skewers: 20,
    icon: '🦖🔥',
    descriptionTh: 'ช่วยย่าง 20 ไม้',
    badgeColor: 'from-green-500 to-emerald-700',
  },
  mishka_bear: {
    id: 'mishka_bear',
    nameTh: 'หมีมีชคา',
    category: 'grill_help',
    coins: 100,
    skewers: 100,
    icon: '🐻👑',
    descriptionTh: 'ช่วยย่าง 100 ไม้ (ซูเปอร์เชฟ!)',
    badgeColor: 'from-amber-400 via-orange-500 to-purple-600',
  },
  screen_like: {
    id: 'screen_like',
    nameTh: 'เคาะจอเคาะใจ 100 ครั้ง',
    category: 'grill_help',
    coins: 0,
    skewers: 1,
    icon: '❤️',
    descriptionTh: 'ครบ 100 ใจ = ช่วยย่าง 1 ไม้',
    badgeColor: 'from-red-500 to-rose-600',
  },
};

export interface TikTokUser {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
}

export interface LiveAlert {
  id: string;
  user: TikTokUser;
  gift: GiftDefinition;
  skewers: number;
  isJackpot?: boolean;
  timestamp: number;
}

export interface OrderItem {
  id: string;
  user: TikTokUser;
  giftId: GiftId;
  skewers: number;
  isJackpot?: boolean;
  status: 'pending' | 'served';
  timestamp: number;
}

export interface HelperRecord {
  userId: string;
  username: string;
  nickname: string;
  avatar: string;
  skewersGrilled: number;
  lastActive: number;
}

export interface BuyerRecord {
  userId: string;
  username: string;
  nickname: string;
  avatar: string;
  skewersOrdered: number;
  skewersDelivered: number;
  totalCoins: number;
  lastActive: number;
}

export interface LiveSessionStats {
  isActive: boolean;
  startTime: number;
  endTime?: number;
  readyStock: number;          // จำนวนไม้ที่ย่างเสร็จแล้วบนถาดรอขาย
  rawSquidsInTank: number;     // จำนวนปลาหมึกสดในตู้
  totalSkewersGrilled: number; // ยอดช่วยย่างสะสม
  totalSkewersSold: number;    // ยอดขายสะสม
  totalOrdersCount: number;    // จำนวนออเดอร์ทั้งหมด
  totalLikesCount: number;     // จำนวนเคาะใจสะสม
  currentLikesPool: number;    // เศษใจรอสะสมให้ครบ 100
  giftCountSummary: Record<GiftId, number>;
}

export type SkewerStage = 'grilling_side_a' | 'need_flip' | 'grilling_side_b' | 'cooked';

export interface GrillingSkewer {
  id: string;
  count: number; // จำนวนไม้ในชิ้นนี้ (1 ไม้ หรือรวมเป็นชุด)
  sideASeconds: number; // เวลาด้านแรก (e.g. 4s)
  sideBSeconds: number; // เวลาด้านสอง (e.g. 4s)
  currentSecondsLeft: number;
  stage: SkewerStage;
  isFlipped: boolean;
  createdAt: number;
}
