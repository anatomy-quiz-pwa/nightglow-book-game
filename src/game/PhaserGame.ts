import * as Phaser from "phaser";
import { BootScene } from "./BootScene";
import { WorldScene } from "./WorldScene";
import type { Character } from "@/types/database";

export function createPhaserGame(
  container: HTMLDivElement,
  onCharacterClick: (character: Character) => void
): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
    parent: container,
    backgroundColor: "#0f172a",
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
      arcade: { debug: false },
    },
    scene: [
      { key: "BootScene", scene: BootScene, data: { onCharacterClick } },
      WorldScene,
    ],
  };

  return new Phaser.Game(config);
}

export type { WorldScene } from "./WorldScene";
