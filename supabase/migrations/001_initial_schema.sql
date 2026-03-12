-- 夜光拆書樂園 - 初始資料庫結構

-- 角色表
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  dialogue TEXT NOT NULL,
  unlock_question TEXT,
  unlock_answer TEXT
);

-- 玩家表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 玩家已解鎖角色表
CREATE TABLE IF NOT EXISTS user_characters (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  unlock_time TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, character_id)
);

-- 啟用 RLS
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_characters ENABLE ROW LEVEL SECURITY;

-- 允許匿名讀取 characters
CREATE POLICY "characters_read" ON characters FOR SELECT USING (true);

-- 允許匿名讀取 users
CREATE POLICY "users_read" ON users FOR SELECT USING (true);

-- 允許匿名讀取 user_characters
CREATE POLICY "user_characters_read" ON user_characters FOR SELECT USING (true);

-- 允許匿名插入 users（用於新玩家）
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (true);

-- 允許匿名插入 user_characters（用於解鎖）
CREATE POLICY "user_characters_insert" ON user_characters FOR INSERT WITH CHECK (true);

-- 種子資料：範例角色（含解鎖問題）
INSERT INTO characters (id, name, area, image, description, dialogue, unlock_question, unlock_answer) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', '神經指揮家', '知識塔', '/characters/neural_conductor.png', '掌管神經訊號的指揮家，擅長協調身體各部位的溝通。', '我正在巡查神經訊號。', '神經系統的主要功能是什麼？', '傳遞訊號'),
  ('a1b2c3d4-0002-4000-8000-000000000002', '筋膜行者', '問號森林', '/characters/fascia_walker.png', '穿梭於筋膜網絡的探險家，了解身體的連結與延展。', '筋膜是身體的隱形地圖。', '筋膜的主要特性是什麼？', '連結'),
  ('a1b2c3d4-0003-4000-8000-000000000003', '步態工程師', '練功小鎮', '/characters/gait_engineer.png', '專精步態分析的工程師，優化行走與跑步的效能。', '每一步都是精密的工程。', '步態分析關注什麼？', '行走')
ON CONFLICT (id) DO NOTHING;
