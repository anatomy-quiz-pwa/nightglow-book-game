// 區域在地圖上的座標（像素）
// 地圖尺寸 1536×1024
export const AREA_POSITIONS: Record<string, { x: number; y: number }> = {
  夜光咖啡館: { x: 768, y: 512 },
  問號森林: { x: 350, y: 200 },
  知識塔: { x: 900, y: 220 },
  練功小鎮: { x: 1200, y: 450 },
  回聲山谷: { x: 700, y: 850 },
  風帆港灣: { x: 1100, y: 900 },
  傳奇學院: { x: 1350, y: 780 },
  夜光書店: { x: 200, y: 300 },
  英雄百貨: { x: 1300, y: 400 },
  夜光生活超市: { x: 500, y: 500 },
  夜光電台: { x: 900, y: 900 },
  實證加油站: { x: 600, y: 400 },
};

// 角色巡邏範圍（每個區域的活動邊界）
export const AREA_BOUNDS: Record<
  string,
  { minX: number; maxX: number; minY: number; maxY: number }
> = {
  夜光咖啡館: { minX: 668, maxX: 868, minY: 412, maxY: 612 },
  問號森林: { minX: 250, maxX: 450, minY: 100, maxY: 300 },
  知識塔: { minX: 800, maxX: 1000, minY: 120, maxY: 320 },
  練功小鎮: { minX: 1100, maxX: 1300, minY: 350, maxY: 550 },
  回聲山谷: { minX: 600, maxX: 800, minY: 750, maxY: 950 },
  風帆港灣: { minX: 1000, maxX: 1200, minY: 800, maxY: 1000 },
  傳奇學院: { minX: 1250, maxX: 1450, minY: 680, maxY: 880 },
  夜光書店: { minX: 100, maxX: 300, minY: 200, maxY: 400 },
  英雄百貨: { minX: 1200, maxX: 1400, minY: 300, maxY: 500 },
  夜光生活超市: { minX: 400, maxX: 600, minY: 400, maxY: 600 },
  夜光電台: { minX: 800, maxX: 1000, minY: 800, maxY: 1000 },
  實證加油站: { minX: 500, maxX: 700, minY: 300, maxY: 500 },
};

// 預設區域（若角色 area 不在上表）
export const DEFAULT_AREA = "夜光咖啡館";

// 建築物座標
export const BUILDING_WHATSUP_CAFE = { x: 768, y: 512 };
export const BUILDING_PROXIMITY_RANGE = 120;

// 解鎖頁：角色卡片背面（掃描 QR 後先看到）
export const CARD_BACK_PATH = "/characters/cards/back/card%20back.png";

// 解鎖頁：角色卡片正面（答對後顯示）
export const CHARACTER_CARD_FRONT: Record<string, string> = {
  神經指揮家: "/characters/Neural%20Conductor.webp",
  筋膜旅者: "/characters/Fascia%20Walker.webp",
  步態工程師: "/characters/Gait%20Engineer.webp",
  彈性守護者: "/characters/map/Elastic%20Guardian.png",
  演化觀察者: "/characters/Evolution%20Watcher.webp",
  典藏守書人: "/characters/Archive%20Keeper.webp",
};

// 地圖上小人：對應 public/characters/map/
export const CHARACTER_MAP_SPRITES: Record<string, string> = {
  神經指揮家: "/characters/map/Neural%20Conductor.png",
  筋膜旅者: "/characters/map/Fascia%20Walker.png",
  步態工程師: "/characters/map/Gait%20Engineer.png",
  彈性守護者: "/characters/map/Elastic%20Guardian.png",
  演化觀察者: "/characters/map/Evolution%20Watcher.png",
  典藏守書人: "/characters/map/Archive%20Keeper.png",
};

// Phaser 地圖 sprite：優先 map/，無則用卡片正面
export const CHARACTER_IMAGES: Record<string, string> = {
  ...CHARACTER_CARD_FRONT,
  彈性守護者: "/characters/map/Elastic%20Guardian.png",
};
