import Phaser from "phaser";
import { debugDraw } from "../utils/debug";
import { createLizardAnims } from "../anims/EnemyAnims";
import { createCharacterAnims } from "../anims/CharacterAnims";
import Lizard from "../enemies/Lizard";
import "../characters/Faune";
import Faune from "../characters/Faune";
import { sceneEvents } from "../events/EventCenter";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;
  constructor() {
    super("game");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.scene.run("game-ui");
    createCharacterAnims(this.anims);
    createLizardAnims(this.anims);
    const map = this.make.tilemap({ key: "dungeon" });
    const tileSet = map.addTilesetImage("dungeon", "tiles", 16, 16, 1, 2);
    map.createStaticLayer("Floor", tileSet);
    const wallsLayer = map.createStaticLayer("Walls", tileSet);
    wallsLayer.setCollisionByProperty({ collides: true });
    debugDraw(wallsLayer, this);
    this.faune = this.add.faune(128, 128, "faune");
    // this.faune = this.physics.add.sprite(128, 128, "faune", "walk-down-3.png");
    // this.faune.body.setSize(this.faune.width * 0.5, this.faune.height * 0.8);
    // this.faune.anims.play("faune-idle-down");

    this.cameras.main.startFollow(this.faune, true);
    const lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (go) => {
        const lizGo = go as Lizard;
        lizGo.body.onCollide = true;
      },
    });
    lizards.get(256, 128, "lizard");
    this.physics.add.collider(this.faune, wallsLayer);
    this.physics.add.collider(lizards, wallsLayer);
    this.physics.add.collider(
      lizards,
      this.faune,
      this.handlePlayerLizardCollision,
      undefined,
      this
    );
  }

  private handlePlayerLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const lizard = obj2 as Lizard;
    const dx = this.faune.x - lizard.x;
    const dy = this.faune.y - lizard.y;
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
    // this.faune.handleDamage(dir);
    sceneEvents.emit("player-health-changed", this.faune.health);
  }
  update(t: number, dt: number) {
    if (this.faune) {
      this.faune.update(this.cursors);
    }
  }
}
