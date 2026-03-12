# 夜光拆書樂園 (Nocturnal Book World)

探索式教育世界 MVP：玩家掃描角色卡 QR code 解鎖角色，角色會出現在世界地圖中並活動。

## 技術架構

- **Frontend**: Next.js (App Router) + TypeScript
- **Game Engine**: Phaser.js
- **Database**: Supabase
- **Hosting**: Vercel

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定 Supabase

1. 在 [Supabase](https://supabase.com) 建立專案
2. 複製 `.env.example` 為 `.env.local`
3. 填入 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 在 Supabase SQL Editor 執行 `supabase/migrations/001_initial_schema.sql`

### 3. 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 即可看到世界地圖。

> **注意**：若專案路徑含中文，`npm run build` 已設定使用 webpack 以避免 Turbopack 編譯問題。

## 功能說明

### 世界地圖

- 可拖動、縮放（滑鼠滾輪）
- 中央為夜光咖啡館，周圍有問號森林、知識塔、練功小鎮等區域

### QR 解鎖流程

每張角色卡的 QR code 指向：`/unlock/[characterId]`

1. 掃描 QR → 進入解鎖頁
2. 回答與課程相關的問題
3. 答對後呼叫 API 寫入 `user_characters`
4. 角色會出現在地圖對應區域

### 角色範例

| 角色       | 區域     | 解鎖 URL |
|------------|----------|----------|
| 神經指揮家 | 知識塔   | `/unlock/a1b2c3d4-0001-4000-8000-000000000001` |
| 筋膜行者   | 問號森林 | `/unlock/a1b2c3d4-0002-4000-8000-000000000002` |
| 步態工程師 | 練功小鎮 | `/unlock/a1b2c3d4-0003-4000-8000-000000000003` |

解鎖問題答案：神經指揮家「傳遞訊號」、筋膜行者「連結」、步態工程師「行走」

### 地圖互動

- 點擊角色 sprite 可查看名稱、介紹與對話
- 角色會隨機移動（每 3 秒）

## 專案結構

```
/app
  page.tsx              # 首頁（世界地圖）
  layout.tsx
  /unlock/[characterId]/page.tsx  # 解鎖頁
  /api/unlock/route.ts            # 解鎖 API

/components
  WorldMap.tsx          # Phaser 地圖容器
  CharacterPopup.tsx   # 角色彈窗

/game
  PhaserGame.ts        # Phaser 初始化
  WorldScene.ts        # 世界場景
  CharacterSprite.ts   # 角色 sprite
  config.ts            # 區域座標

/lib
  supabase.ts

/public
  map.svg              # 地圖（可替換為 map.png）
  characters/          # 角色 sprite 圖檔
```

## 自訂地圖

將自訂地圖命名為 `map.png` 並放入 `public/`，系統會優先使用。預設使用 `map.svg`。

## 部署至 Vercel

1. 推送至 GitHub
2. 在 Vercel 匯入專案
3. 設定環境變數
4. 部署
