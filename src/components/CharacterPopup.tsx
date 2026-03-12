"use client";

import type { Character } from "@/types/database";

interface CharacterPopupProps {
  character: Character;
  onClose: () => void;
}

export function CharacterPopup({ character, onClose }: CharacterPopupProps) {
  const hasScript =
    character.script_guide || character.script_hint || character.script_question;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="mx-auto max-w-md rounded-2xl bg-slate-800 p-6 shadow-xl ring-1 ring-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-amber-200">{character.name}</h3>

        {hasScript ? (
          <div className="mt-4 space-y-3">
            {character.script_guide && (
              <p className="text-sm text-slate-300">
                <span className="text-amber-400/80">引導：</span>
                {character.script_guide}
              </p>
            )}
            {character.script_hint && (
              <p className="text-sm text-slate-300">
                <span className="text-amber-400/80">提示：</span>
                {character.script_hint}
              </p>
            )}
            {character.script_question && (
              <p className="text-sm font-medium text-amber-200">
                <span className="text-amber-400/80">問題：</span>
                {character.script_question}
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-slate-300">{character.description}</p>
            <blockquote className="mt-4 border-l-4 border-amber-500 pl-4 italic text-amber-100">
              「{character.dialogue}」
            </blockquote>
          </>
        )}

        {character.background_story && (
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            {character.background_story}
          </p>
        )}

        <p className="mt-2 text-xs text-slate-500">區域：{character.area}</p>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500"
        >
          關閉
        </button>
      </div>
    </div>
  );
}
