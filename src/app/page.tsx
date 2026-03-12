"use client";

import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import("@/components/WorldMap").then((m) => ({ default: m.WorldMap })), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <div className="text-center text-amber-200">
        <p className="text-xl">夜光拆書樂園</p>
        <p className="mt-2 text-sm text-slate-400">載入世界中...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <WorldMap />
    </main>
  );
}
