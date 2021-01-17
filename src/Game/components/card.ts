import {
  CARD_WIDTH,
  CARD_HEIGHT
} from "../constants";

const FLIP_TIME = 1000;
const FADE_TIME = 2500;

interface Position {
  x: number,
  y: number
};

function getShownCardCount(deck: Array<any>) {
  return deck.reduce((count: number, c: any) => {
    return !c.isFaceDown ? ++count : count;
  }, 0);
}

export default class Card {
  readonly game: any
  readonly cardName: string
  readonly cardNumber: number
  readonly card: any
  readonly cardface: any
  isShowing: boolean
  isFaceDown: boolean
  isMatched: boolean
  constructor(game: any, position: Position, cardName: string, cardNumber: number) {
    this.game = game;
    this.cardName = cardName;
    this.cardNumber = cardNumber;
    this.isShowing = false;
    this.isFaceDown = true;
    this.isMatched = false;
    this.card = game.add
      .image(position.x, position.y, "cardDown")
      .setDisplaySize(CARD_WIDTH, CARD_HEIGHT)
      .setInteractive({ cursor: 'pointer' });

    this.cardface = game.add
      .image(position.x, position.y, cardName)
      .setDisplaySize(CARD_WIDTH, CARD_HEIGHT)
      .setInteractive({ cursor: 'pointer' })
      .setVisible(false);

    this.card.on('pointerdown', () => {
      const { deck } = game.objects;
      const cardShownCount = getShownCardCount(deck);
      if (cardShownCount >= 2) return;
      this.show();
    });
  }

  show = () => {
    this.isShowing = true;
    this.isFaceDown = false;
    this.card.setVisible(false);
    this.cardface.setVisible(true);
    // TODO: add flip animation
  };

  reset = () => {
    this.isShowing = false;

    // TODO: add flip animation
    setTimeout(() => {
      this.isFaceDown = true;
      this.card.setVisible(true);
      this.cardface.setVisible(false);
    }, FLIP_TIME);
  };

  matched = () => {
    const { game, card, cardface } = this;
    this.isMatched = true;
    this.isShowing = false;
    this.isFaceDown = true;

    game.tweens.add({
      targets: cardface,
      alpha: 0,
      duration: FADE_TIME - 500,
      ease: 'Power2'
    });

    setTimeout(() => {
      card.destroy();
      cardface.destroy();
    }, FADE_TIME);
  };
}
