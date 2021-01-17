import React, { useEffect, useRef } from 'react';
import Phaser from "phaser";

import * as controls from "./controls";

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
  GAME_BOARD_HEIGHT,
  CARD_ROWS,
  CARD_COLUMNS,
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_SPACING,
  TEXT_STYLE,
} from "./constants";

// sourece: https://stackoverflow.com/a/6274381
function shuffle(a: Array<any>) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function gameStart(game: any) {
  const allCards: Array<any> = [];
  let count = 0;
  let cardPostions = [];
  const timer = controls.addTimer(game);
  const cardClicked = function (this: any) {
    controls.processCardClick(allCards, this).then(() => {
      isGameEnded(game, timer, allCards);
    });
  };

  for (let y = 1; y <= CARD_ROWS; y++) {
    for (let x = 1; x <= CARD_COLUMNS; x++) {
      let position = {
        number: ++count,
        x: x * (CARD_WIDTH + CARD_SPACING),
        y: y * (CARD_HEIGHT + CARD_SPACING)
      };
      cardPostions.push(position);
    }
  }

  cardPostions = shuffle(cardPostions);

  for (let i = 0; i < 12; i++) {
    const cardNumber = i + 1;
    const card1 = controls.createCard(game, cardPostions[i], `card${cardNumber}`, i);
    const card2 = controls.createCard(game, cardPostions[i + 12], `card${cardNumber}`, i + 12);

    allCards.push(card1);
    allCards.push(card2);

    card1.on('pointerdown', cardClicked);
    card2.on('pointerdown', cardClicked);
  }
}

function isGameEnded(game: any, timer: any, allCards: Array<any>) {
  let isAllMatched = true;
  allCards.forEach((card) => { isAllMatched = isAllMatched && !card.active; });
  if (isAllMatched) gameEnd(game, timer);
}

function gameEnd(game: any, timer: any) {
  clearInterval(timer.getData("interval"));
  const time = timer.getData("formatedTime");
  const completeText = game.add
    .text(GAME_BOARD_WIDTH / 2, 150, `Memory Game Completed in ${time}!!`, { ...TEXT_STYLE, fontSize: "24px"})
    .setOrigin(.5, .5);
  const restartButton = controls.addRestartButton(game);
  restartButton.on('pointerdown', () => {
    completeText.destroy();
    restartButton.destroy();
    timer.destroy();
    gameStart(game);
  });
}

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
  this.objects.background = this.add
    .image(0, 0, "background")
    .setOrigin(0, 0)
    .setDisplaySize(GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
  
  this.objects.startButton = controls.addStartButton(this);
  this.objects.startButton.on('pointerdown', () => {
    this.objects.startButton.destroy();
    gameStart(this);
  });
}

const config = {
  type: Phaser.AUTO,
  parent: "game-board",
  width: GAME_BOARD_WIDTH,
  height: GAME_BOARD_HEIGHT,
  scene: {
    preload: preload,
    create: create
  }
};

function Game() {
  const gameBoard: any = useRef(null);
  useEffect(() => {
    // recreates game
    if (gameBoard) gameBoard.current.innerHTML = "";
    new Phaser.Game(config);
  });

  return (
    <div id="game-board" ref={gameBoard} className="game-board" />
  );
}

export default Game;
