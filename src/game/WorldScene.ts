import * as Phaser from "phaser";
import { CharacterSprite } from "./CharacterSprite";
import {
  AREA_POSITIONS,
  CHARACTER_MAP_SPRITES,
  DEFAULT_AREA,
} from "./config";
import type { Character } from "@/types/database";

const MAP_WIDTH = 1536;
const MAP_HEIGHT = 1024;

export interface SpawnCharacter extends Character {
  onCharacterClick?: (character: Character) => void;
}

export class WorldScene extends Phaser.Scene {
  private characters: CharacterSprite[] = [];
  private onCharacterClick?: (character: Character) => void;

  constructor() {
    super({ key: "WorldScene" });
  }

  init(data?: { onCharacterClick?: (character: Character) => void }) {
    this.onCharacterClick =
      data?.onCharacterClick ??
      (this.game.registry.get("onCharacterClick") as (c: Character) => void);
  }

  preload() {
    this.load.image("map", "/map.png");
    // 地圖上小人：使用 characters/map/ 對應圖檔
    Object.entries(CHARACTER_MAP_SPRITES).forEach(([name, path]) => {
      this.load.image(`char_${name}`, path);
    });
  }

  create() {
    // 地圖：1536×1024，中心點 (768, 512)
    const mapExists = this.textures.exists("map");
    if (mapExists) {
      this.add.image(768, 512, "map");
    } else {
      // Placeholder：地圖載入失敗時
      const bg = this.add.rectangle(768, 512, MAP_WIDTH, MAP_HEIGHT, 0x0f172a, 1);
      this.add.text(768, 512, "夜光咖啡館", { fontSize: "48px", color: "#fbbf24" }).setOrigin(0.5);
    }

    // 相機：世界邊界 1536×1024，可拖動
    this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    this.cameras.main.setZoom(0.8);
    this.cameras.main.centerOn(768, 512);

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return;
      const cam = this.cameras.main;
      cam.scrollX -= (pointer.x - pointer.prevPosition.x) / cam.zoom;
      cam.scrollY -= (pointer.y - pointer.prevPosition.y) / cam.zoom;
    });

    this.input.on("wheel", (
      _pointer: Phaser.Input.Pointer,
      _gameObjects: Phaser.GameObjects.GameObject[],
      _deltaX: number,
      deltaY: number
    ) => {
      const cam = this.cameras.main;
      const newZoom = Phaser.Math.Clamp(cam.zoom - deltaY * 0.001, 0.3, 1.5);
      cam.setZoom(newZoom);
    });

    // 接收要 spawn 的角色（由 React 傳入）
    this.events.on("spawnCharacters", (chars: SpawnCharacter[]) => {
      this.spawnCharacters(chars);
    });

    // 若已有角色資料（從 registry 來），立即 spawn
    const initialChars = this.game.registry.get("characters") as SpawnCharacter[] | undefined;
    if (initialChars?.length) {
      this.spawnCharacters(initialChars);
    }

  }

  update() {}

  spawnCharacters(characters: SpawnCharacter[]) {
    // 清除舊角色
    this.characters.forEach((c) => c.destroy());
    this.characters = [];

    characters.forEach((char) => {
      const pos =
        AREA_POSITIONS[char.area] ?? AREA_POSITIONS[DEFAULT_AREA] ?? { x: 500, y: 500 };
      const jitterX = Phaser.Math.Between(-40, 40);
      const jitterY = Phaser.Math.Between(-40, 40);

      const sprite = new CharacterSprite(this, pos.x + jitterX, pos.y + jitterY, {
        ...char,
        onCharacterClick: this.onCharacterClick ?? char.onCharacterClick,
      });

      sprite.startAreaPatrol();
      this.characters.push(sprite);
    });
  }
}
