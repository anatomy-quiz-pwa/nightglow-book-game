import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, characterId } = body;

    if (!userId || !characterId) {
      return NextResponse.json(
        { error: "缺少 userId 或 characterId" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 若使用者不存在則建立
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (!existingUser) {
      await supabase.from("users").insert({
        id: userId,
        name: `玩家-${userId.slice(0, 8)}`,
      });
    }

    // 新增 user_characters（寫入 user_id、character_id、unlock_time）
    const { data: insertedRow, error } = await supabase
      .from("user_characters")
      .insert({
        user_id: userId,
        character_id: characterId,
      })
      .select("user_id, character_id, unlock_time")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { success: true, message: "角色已解鎖", alreadyUnlocked: true },
          { status: 200 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "角色解鎖成功！",
      inserted: insertedRow,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "伺服器錯誤" },
      { status: 500 }
    );
  }
}
