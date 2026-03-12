import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

// 必須有有效的 Supabase 設定，否則 createClient 會拋錯
if (!supabaseUrl.startsWith("https://") || !supabaseUrl.includes(".supabase.co") || supabaseAnonKey.length < 50) {
  throw new Error(
    "請在 Vercel 專案設定中加入環境變數：NEXT_PUBLIC_SUPABASE_URL 與 NEXT_PUBLIC_SUPABASE_ANON_KEY，並重新部署。"
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
