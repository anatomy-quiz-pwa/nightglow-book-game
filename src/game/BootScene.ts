import * as Phaser from "phaser";
import type { Character } from "@/types/database";

export interface BootSceneData {
  onCharacterClick?: (character: Character) => void;
}

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  init(data: BootSceneData) {
    if (data?.onCharacterClick) {
      this.registry.set("onCharacterClick", data.onCharacterClick);
    }
  }

  create() {
    this.scene.start("WorldScene");
  }
}
