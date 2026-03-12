"use client";

import { useEffect, useRef, useState } from "react";
import { createPhaserGame } from "@/game/PhaserGame";
import { CharacterPopup } from "./CharacterPopup";
import { supabase } from "@/lib/supabase";
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

export function WorldMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<ReturnType<typeof createPhaserGame> | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const loadCharacters = async () => {
      const userId = getOrCreateUserId();
      if (!userId) return;

      const { data: userChars } = await supabase
        .from("user_characters")
        .select("character_id")
        .eq("user_id", userId);

      if (!userChars?.length) {
        setCharacters([]);
        return;
      }

      const ids = userChars.map((uc: { character_id: string }) => uc.character_id);
      const { data: chars } = await supabase
        .from("characters")
        .select("*")
        .in("id", ids);

      setCharacters(chars ?? []);
    };

    loadCharacters();

    const game = createPhaserGame(containerRef.current, (char) => {
      setSelectedCharacter(char);
    });
    gameRef.current = game;

    const interval = setInterval(loadCharacters, 5000);

    return () => {
      clearInterval(interval);
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    const game = gameRef.current;
    if (!game) return;

    game.registry.set("characters", characters);
    const scene = game.scene.getScene("WorldScene");
    if (scene) {
      scene.events.emit("spawnCharacters", characters);
    }
  }, [characters]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-900">
      <div ref={containerRef} className="h-full w-full" />
      <a
        href="/qr"
        className="absolute right-4 top-4 z-[9999] rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-bold text-white shadow-xl ring-2 ring-amber-400/50 transition-colors hover:bg-amber-500"
      >
        📋 角色卡 QR Code
      </a>
      {selectedCharacter && (
        <CharacterPopup
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </div>
  );
}
