-- 在 Supabase Dashboard → SQL Editor 貼上並執行
-- 新增選擇題欄位並更新六個角色

ALTER TABLE characters ADD COLUMN IF NOT EXISTS background_story TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS script_guide TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS script_hint TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS script_question TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS choice_a TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS choice_b TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS choice_c TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS choice_d TEXT;

INSERT INTO characters (
  id, name, area, image, description, dialogue,
  background_story, script_guide, script_hint, script_question,
  choice_a, choice_b, choice_c, choice_d, unlock_question, unlock_answer
) VALUES
('a1b2c3d4-0001-4000-8000-000000000001', '神經指揮家', '知識塔', '/characters/Neural Conductor.webp', '神經控制與節奏', '我正在巡查神經訊號。',
'能聽見神經訊號的節奏，相信行走是脊髓指揮的交響樂。', '你知道嗎？行走其實是潛意識的。', '脊髓裡有神經迴路，能自動產生節奏。', '這個機制叫做什麼？',
'大腦皮質', '小腦', '中樞模式產生器 (CPG)', '基底核', '行走時脊髓的神經迴路機制是？', 'C'),
('a1b2c3d4-0002-4000-8000-000000000002', '筋膜旅者', '問號森林', '/characters/Fascia Walker.webp', '筋膜鏈與張力連續體', '筋膜是身體的隱形地圖。',
'在身體內旅行的人，能感受力量透過筋膜鏈傳遍全身。', '行走時，力量如何在身體傳遞？', '透過筋膜鏈，力量形成張力網絡。', '主要透過什麼傳遞力量？',
'單一肌肉', '只有骨骼', '筋膜張力網絡', '只有關節', '行走時力量主要透過什麼傳遞？', 'C'),
('a1b2c3d4-0003-4000-8000-000000000003', '步態工程師', '練功小鎮', '/characters/Gait Engineer.webp', '步態生物力學', '每一步都是精密的工程。',
'把跑步機、測力板、感測器搬進實驗室的「瘋狂工程師」。', '影響行走能量消耗的因素有哪些？', '步長、步頻、重力、動能回收。', '最省能的行走速度約為？',
'1 km/h', '2 km/h', '4-5 km/h', '10 km/h', '最省能的行走速度約為？', 'C'),
('a1b2c3d4-0004-4000-8000-000000000004', '彈性守護者', '夜光咖啡館', '/characters/map/Elastic Guardian.png', '行走的彈性能量機制', '彈性是身體的禮物。',
'拆書樂園最年長的守護者，研究人體如何透過肌腱與被動力量節省能量。', '行走時，身體如何「回收能量」？', '肌腱與被動結構儲存並釋放彈性能量。', '行走時機械能回收率約為？',
'10-20%', '30-40%', '60-70%', '90%', '行走時機械能回收率約為？', 'C'),
('a1b2c3d4-0005-4000-8000-000000000005', '演化觀察者', '回聲山谷', '/characters/Evolution Watcher.webp', '人類雙足行走的演化', '演化記錄了每一步。',
'穿越時空的旅人，見證人類從森林古猿演化為草原居民的過程。', '從樹棲移動到雙足行走，發生了什麼？', '骨盆與股骨形狀的改變，適應長距離移動。', '人類演化出雙足行走的主要原因？',
'增加跳躍能力', '增加跑步速度', '長距離移動更省能', '手臂變短', '人類演化出雙足行走的主要原因？', 'C'),
('a1b2c3d4-0006-4000-8000-000000000006', '典藏守書人', '夜光書店', '/characters/Archive Keeper.webp', '跨領域整合', '每本書都只說了一部分。',
'拆書樂園的典藏者，讀過所有書，理解書與書之間的關係。', '彈性能量、演化、筋膜、生物力學、神經控制，各自解釋了行走的一部分。', '沒有一本書能單獨解釋完整的「行走」。', '對「行走」最合理的跨領域理解是？',
'單一肌肉作用', '單一關節運動', '單一神經控制', '多系統整合現象', '對「行走」最合理的跨領域理解是？', 'D')
ON CONFLICT (id) DO UPDATE SET
  background_story = EXCLUDED.background_story,
  script_guide = EXCLUDED.script_guide,
  script_hint = EXCLUDED.script_hint,
  script_question = EXCLUDED.script_question,
  choice_a = EXCLUDED.choice_a,
  choice_b = EXCLUDED.choice_b,
  choice_c = EXCLUDED.choice_c,
  choice_d = EXCLUDED.choice_d,
  unlock_question = EXCLUDED.unlock_question,
  unlock_answer = EXCLUDED.unlock_answer,
  description = EXCLUDED.description,
  dialogue = EXCLUDED.dialogue,
  image = EXCLUDED.image,
  area = EXCLUDED.area;
