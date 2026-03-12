"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

const CHARACTERS = [
  { id: "a1b2c3d4-0001-4000-8000-000000000001", name: "神經指揮家" },
  { id: "a1b2c3d4-0002-4000-8000-000000000002", name: "筋膜旅者" },
  { id: "a1b2c3d4-0003-4000-8000-000000000003", name: "步態工程師" },
  { id: "a1b2c3d4-0004-4000-8000-000000000004", name: "彈性守護者" },
  { id: "a1b2c3d4-0005-4000-8000-000000000005", name: "演化觀察者" },
  { id: "a1b2c3d4-0006-4000-8000-000000000006", name: "典藏守書人" },
];

export default function QRPage() {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8">
      <h1 className="mb-2 text-center text-2xl font-bold text-amber-200">
        角色卡 QR Code（供列印）
      </h1>
      <p className="mb-8 text-center text-sm text-slate-400">
        每張卡對應一個角色，學生掃描後會進入該角色的解鎖頁面
      </p>

      {/* 網址前綴（列印前請改為正式網址） */}
      <div className="mx-auto mb-8 max-w-md">
        <label className="mb-2 block text-sm text-slate-400">解鎖頁面網址前綴：</label>
        <input
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://yoursite.com"
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
        />
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-3">
        {CHARACTERS.map((char) => {
          const url = `${baseUrl}/unlock/${char.id}`;
          return (
            <div
              key={char.id}
              className="flex flex-col items-center rounded-xl bg-white p-6 print:break-inside-avoid"
            >
              <QRCodeSVG value={url} size={180} level="M" includeMargin />
              <p className="mt-4 text-center font-bold text-slate-800">{char.name}</p>
              <p className="mt-1 text-center text-xs text-slate-500">
                掃描後進入解鎖頁面
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-12 text-center text-sm text-slate-500">
        <a href="/" className="text-amber-400 hover:underline">
          返回世界地圖
        </a>
      </p>
    </div>
  );
}
