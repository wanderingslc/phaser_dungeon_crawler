import Phaser from "phaser";

import Game from "./scenes/Game";
import Preloader from "./scenes/Preloader";
import GameUI from "./scenes/GameUI";

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [Preloader, Game, GameUI],
  scale: {
    zoom: 1.5,
  },
});
