import React, { useState, useEffect, useRef } from 'react';
import Phaser from "phaser";

import * as controls from "./controls";

import backgroundImg from "./assets/background.jpg";
import cardDownImg from "./assets/cards/card-down.jpg";
import card1Img from "./assets/cards/anna-elsa.png";
import card2Img from "./assets/cards/anna-olaf.png";
import card3Img from "./assets/cards/anna.png";
import card4Img from "./assets/cards/elsa-anna.png";
import card5Img from "./assets/cards/elsa.png";
import card6Img from "./assets/cards/hans.png";
import card7Img from "./assets/cards/kristoff-sven.png";
import card8Img from "./assets/cards/kristoff.png";
import card9Img from "./assets/cards/olaf.png";
import card10Img from "./assets/cards/snowflake.png";
import card11Img from "./assets/cards/snowmen.png";
import card12Img from "./assets/cards/sven.png";

import './index.scss';

import {
  GAME_BOARD_WIDTH,
  GAME_BOARD_HEIGHT
} from "./constants";

function preload(this: any) {
  // TODO: load all cards 
  this.load.image("background", backgroundImg);
  this.load.image("cardDown", cardDownImg);
  this.load.image("card1", card1Img);
  this.load.image("card2", card2Img);
  this.load.image("card3", card3Img);
  this.load.image("card4", card4Img);
  this.load.image("card5", card5Img);
  this.load.image("card6", card6Img);
  this.load.image("card7", card7Img);
  this.load.image("card8", card8Img);
  this.load.image("card9", card9Img);
  this.load.image("card10", card10Img);
  this.load.image("card11", card11Img);
  this.load.image("card12", card12Img);
}

function create(this: any) {
  this.objects = {};
  this.state = {
    isGameRunning: false
  };

  this.add
    .image(0, 0, "background")
    .setOrigin(0, 0)
    .setDisplaySize(GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
  
  const startButton = controls.createStartButton(this);
  startButton.on('pointerdown', () => {
    startButton.destroy();
    controls.gameStart(this);
  });
}

function update(this: any) {
  if (!this.state.isGameRunning) return;
  const isGameEnd = controls.isAllCardsMatched(this);

  if (isGameEnd) {
    controls.gameEnd(this);
  } else {
    controls.checkforMatch(this);
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "game-board",
  width: GAME_BOARD_WIDTH,
  height: GAME_BOARD_HEIGHT,
  scene: {
    preload,
    create,
    update
  }
};

function Game() {
  const [game, setGame]: any = useState(null);
  const gameBoard: any = useRef(null);
  const refreshGame = () => {
    if (gameBoard) gameBoard.current.innerHTML = "";
    setGame(new Phaser.Game(config));
  };

  useEffect(() => {
    if (!game) refreshGame();
  });

  return (
    <div id="game-board" ref={gameBoard} className="game-board" />
  );
}

export default Game;
