-- 新增夜光守護龍角色
-- 若先前用 arco 導致失敗，請執行此修正版
INSERT INTO characters (id, name, area, image, description, dialogue, unlock_question, unlock_answer) VALUES
  ('a1b2c3d4-0004-4000-0000-000000000004', '夜光守護龍', '夜光咖啡館', '/characters/map/Elastic Guardian.png', '守護夜光書樂園的使者', '彈性是身體的禮物', '彈性的主要好處是什麼？', '延展')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  area = EXCLUDED.area,
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  dialogue = EXCLUDED.dialogue,
  unlock_question = EXCLUDED.unlock_question,
  unlock_answer = EXCLUDED.unlock_answer;
