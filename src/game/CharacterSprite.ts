import * as Phaser from "phaser";
import { AREA_BOUNDS, DEFAULT_AREA } from "./config";
import type { Character } from "@/types/database";

export interface CharacterSpriteData extends Character {
  onCharacterClick?: (character: Character) => void;
}

const SPRITE_SIZE = 32; // 地圖上的角色顯示尺寸（縮小為一半）

// 陰影參數
const SHADOW_OFFSET_Y = 6;
const SHADOW_WIDTH = 20;
const SHADOW_HEIGHT = 7;
const SHADOW_ALPHA = 0.35;

export class CharacterSprite extends Phaser.GameObjects.Container {
  private characterData: CharacterSpriteData;
  private isMoving = false;
  private moveTimer?: Phaser.Time.TimerEvent;
  private shadow: Phaser.GameObjects.Ellipse;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    characterData: CharacterSpriteData
  ) {
    super(scene, x, y);
    this.characterData = characterData;

    // 1. 陰影：在角色下方，作為第一個子物件（會渲染在最底層）
    this.shadow = scene.add.ellipse(
      0,
      SHADOW_OFFSET_Y,
      SHADOW_WIDTH,
      SHADOW_HEIGHT,
      0x000000,
      SHADOW_ALPHA
    );
    this.add(this.shadow);

    const textureKey = `char_${characterData.name}`;
    const hasTexture = scene.textures.exists(textureKey);

    if (hasTexture) {
      // 2. 細微 outline：放大略大的副本作為邊緣
      const outlineImg = scene.add
        .image(0, 0, textureKey)
        .setDisplaySize(SPRITE_SIZE * 1.06, SPRITE_SIZE * 1.06)
        .setOrigin(0.5, 1)
        .setTint(0xffffff)
        .setAlpha(0.3);
      this.add(outlineImg);

      const img = scene.add
        .image(0, 0, textureKey)
        .setDisplaySize(SPRITE_SIZE, SPRITE_SIZE)
        .setOrigin(0.5, 1);
      this.add(img);
    } else {
      // Fallback：無圖檔時用簡單圖形
      const body = scene.add.circle(0, -SPRITE_SIZE / 2, 10, 0x4ade80, 1);
      body.setStrokeStyle(2, 0x22c55e);
      const head = scene.add.circle(0, -SPRITE_SIZE / 2 - 8, 6, 0xfbbf24, 1);
      head.setStrokeStyle(2, 0xf59e0b);
      this.add([body, head]);
    }

    this.setSize(SPRITE_SIZE, SPRITE_SIZE);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-SPRITE_SIZE / 2, -SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE),
      Phaser.Geom.Rectangle.Contains
    );

    this.on("pointerdown", () => {
      this.showSpeechBubble();
      characterData.onCharacterClick?.(characterData);
    });

    scene.add.existing(this);

    // 3. 柔和 glow（WebGL 模式，Canvas 會略過）
    try {
      this.postFX.addGlow(0xffffff, 4, 0, false, 0.1, 8);
    } catch {
      // Canvas 模式或 FX 不可用時略過
    }
  }

  startAreaPatrol() {
    if (this.moveTimer) return;

    const area =
      AREA_BOUNDS[this.characterData.area] ?? AREA_BOUNDS[DEFAULT_AREA];
    if (!area) return;

    this.moveTimer = this.scene.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => this.doAreaPatrol(area),
    });
  }

  private showSpeechBubble() {
    const dialogue = this.characterData.dialogue;
    const name = this.characterData.name;
    const text = `${name}：\n「${dialogue}」`;

    const bubble = this.scene.add
      .container(this.x, this.y - SPRITE_SIZE - 10)
      .setDepth(1000);

    const label = this.scene.add
      .text(0, 0, text, {
        fontSize: "13px",
        color: "#fbbf24",
        align: "center",
        wordWrap: { width: 200 },
      })
      .setOrigin(0.5);

    const padding = 12;
    const bg = this.scene.add
      .rectangle(
        0,
        0,
        label.width + padding * 2,
        label.height + padding * 2,
        0x1e293b,
        0.95
      )
      .setStrokeStyle(2, 0xfbbf24);

    bubble.add([bg, label]);

    this.scene.time.delayedCall(3000, () => {
      bubble.destroy();
    });
  }

  private doAreaPatrol(area: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }) {
    if (this.isMoving) return;

    const targetX = Phaser.Math.Between(area.minX, area.maxX);
    const targetY = Phaser.Math.Between(area.minY, area.maxY);

    this.isMoving = true;
    this.scene.tweens.add({
      targets: this,
      x: targetX,
      y: targetY,
      duration: 2000,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.isMoving = false;
      },
    });
  }

  destroy(fromScene?: boolean) {
    this.moveTimer?.destroy();
    super.destroy(fromScene);
  }

  getCharacterData() {
    return this.characterData;
  }
}
