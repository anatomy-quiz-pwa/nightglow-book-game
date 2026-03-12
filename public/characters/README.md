# 角色圖片資料夾結構

## cards/back/
- **卡片背面**：學生掃描 QR 後先看到的畫面
- 預設：`card-back.svg`（可替換為自訂設計）

## cards/front/
- **卡片正面**：答對問題後翻轉顯示
- 目前使用 `/characters/` 根目錄的圖片（Neural Conductor.webp 等）
- 可將卡片正面圖移至此資料夾並更新 `config.ts` 的 `CHARACTER_CARD_FRONT`

## map/
- **地圖小人**：出現在世界地圖上的小型 sprite
- 請放入對應角色的圖片，檔名範例：
  - `神經指揮家.webp`
  - `筋膜行者.webp`
  - `步態工程師.webp`
- 放入後需在 `src/game/config.ts` 的 `CHARACTER_MAP_SPRITES` 更新路徑
- 若無專用圖，地圖會使用卡片正面圖作為 fallback
