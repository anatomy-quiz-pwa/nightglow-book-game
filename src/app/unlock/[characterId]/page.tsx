"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CARD_BACK_PATH, CHARACTER_CARD_FRONT } from "@/game/config";
import type { Character } from "@/types/database";

const USER_ID_KEY = "nightglow_user_id";

function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export default function UnlockPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.characterId as string;

  const [character, setCharacter] = useState<Character | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "entering" | "error">("idle");
  const [message, setMessage] = useState("");
  const [showFront, setShowFront] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("id", characterId)
        .single();

      if (error || !data) {
        setStatus("error");
        setMessage("找不到此角色");
        return;
      }
      setCharacter(data);
    }
    load();
  }, [characterId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!character || !selectedChoice) return;

    const expected = character.unlock_answer?.trim().toUpperCase();
    if (!expected) {
      setStatus("error");
      setMessage("此角色尚未設定解鎖答案");
      return;
    }

    if (selectedChoice !== expected) {
      setStatus("error");
      setMessage("答案不正確，請再試一次");
      return;
    }

    setShowFront(true);
    setStatus("correct");

    // 答對後：解鎖角色並寫入資料庫，2 秒後導向地圖
    setStatus("entering");
    const userId = getOrCreateUserId();

    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, characterId }),
    });

    if (!res.ok) {
      const json = await res.json();
      setStatus("error");
      setMessage(json.error ?? "解鎖失敗");
      return;
    }

    setTimeout(() => router.push("/"), 2000);
  };

  if (!character && status !== "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <p className="text-slate-400">載入中...</p>
      </div>
    );
  }

  if (status === "error" && !character) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900">
        <p className="text-red-400">{message}</p>
        <a href="/" className="text-amber-400 hover:underline">
          返回首頁
        </a>
      </div>
    );
  }

  const cardFrontPath = character
    ? (CHARACTER_CARD_FRONT[character.name] ?? character.image)
    : null;
  const choices = [
    { key: "A" as const, label: character?.choice_a },
    { key: "B" as const, label: character?.choice_b },
    { key: "C" as const, label: character?.choice_c },
    { key: "D" as const, label: character?.choice_d },
  ].filter((c) => c.label);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 py-8">
      <h1 className="mb-6 text-xl font-bold text-amber-200">解鎖角色</h1>

      {/* 角色卡片：背面 → 答對後翻轉 → 正面 */}
      <div className="relative mb-8 w-[280px]" style={{ perspective: "1000px" }}>
        <div
          className="relative h-[420px] w-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: showFront ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* 卡片背面 */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl shadow-xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CARD_BACK_PATH}
              alt="卡片背面"
              className="h-full w-full object-cover"
            />
          </div>

          {/* 卡片正面：答對後顯示，人物圖 + 角色名稱 */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl shadow-xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex h-full flex-col">
              {cardFrontPath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cardFrontPath.replace(/%20/g, " ")}
                  alt={character?.name ?? ""}
                  className="h-[320px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[320px] w-full items-center justify-center bg-slate-800 text-amber-200">
                  {character?.name}
                </div>
              )}
              <div className="flex flex-1 flex-col justify-center bg-slate-800/95 px-4 py-3">
                <p className="text-center font-bold text-amber-200">{character?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 答對後：正面卡片下方顯示背景介紹 */}
      {showFront && (character?.background_story ?? character?.description) && (
        <div className="mb-6 w-full max-w-md rounded-xl bg-slate-800/80 px-6 py-4">
          <p className="text-center text-sm leading-relaxed text-slate-300">
            {character?.background_story ?? character?.description}
          </p>
        </div>
      )}

      {(status === "correct" || status === "entering") ? (
        <div className="mb-6 w-full max-w-md rounded-xl bg-amber-500/20 px-6 py-4 text-center">
          <p className="font-bold text-amber-200">
            {status === "entering" ? "解鎖成功！正在進入夜光樂園..." : "解鎖成功！"}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mb-6 w-full max-w-md">
          <p className="mb-2 text-sm text-slate-400">
            {character?.script_guide && (
              <span className="mb-1 block">{character.script_guide}</span>
            )}
            {character?.script_hint && (
              <span className="mb-1 block text-amber-200/80">{character.script_hint}</span>
            )}
            <span className="mt-2 block font-medium text-amber-200">
              {character?.script_question ??
                character?.unlock_question ??
                "請選擇答案："}
            </span>
          </p>
          <div className="mb-3 space-y-2">
            {choices.length > 0 ? (
              choices.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedChoice(key)}
                  className={`block w-full rounded-lg border px-4 py-2 text-left text-sm transition-colors ${
                    selectedChoice === key
                      ? "border-amber-500 bg-amber-500/20 text-amber-200"
                      : "border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <span className="font-bold text-amber-400">{key}.</span> {label}
                </button>
              ))
            ) : (
              <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                <p className="font-medium">尚未設定選擇題選項</p>
                <p className="mt-1 text-amber-200/80">
                  請在 Supabase Dashboard → SQL Editor 執行 <code className="rounded bg-slate-700 px-1">supabase/run_choices_migration.sql</code>
                </p>
              </div>
            )}
          </div>
          {message && status === "error" && (
            <p className="mb-2 text-sm text-red-400">{message}</p>
          )}
          <button
            type="submit"
            disabled={!selectedChoice}
            className="w-full rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-500 disabled:opacity-50"
          >
            確認
          </button>
        </form>
      )}

      <a href="/qr" className="text-sm text-slate-500 hover:text-amber-400">
        返回角色列表
      </a>
      <a href="/" className="mt-2 text-sm text-slate-500 hover:text-amber-400">
        返回世界地圖
      </a>
    </div>
  );
}
