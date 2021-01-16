import React from 'react';
import Phaser from "phaser";

import logoImg from "./assets/me-suzie.jpg";

import './index.scss';

function preload(this: any) {
  // TODO: load all cards 
  this.load.image("logo", logoImg);
}

function create(this: any) {
  const logo = this.add.image(400, 150, "logo");
  this.tweens.add({
    targets: logo,
    y: 450,
    duration: 2000,
    ease: "Power2",
    yoyo: true,
    loop: -1
  });
}

function update(this: any) {
}

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 700,
  height: 500,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

new Phaser.Game(config);

function Game() {
  return (
    <div id="phaser-example" className="game-board" />
  );
}

export default Game;
