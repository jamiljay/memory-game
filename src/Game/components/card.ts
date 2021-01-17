import {
  CARD_WIDTH,
  CARD_HEIGHT
} from "../constants";

interface Position {
  x: number,
  y: number
};

function getShownCardCount(deck: Array<any>) {
  return deck.reduce((count: number, c: any) => {
    return c.isShowing ? ++count : count;
  }, 0);
}

export default class Card {
  game: any
  cardName: string
  cardNumber: number
  isShowing: boolean
  isMatched: boolean
  card: any
  constructor(game: any, position: Position, cardName: string, cardNumber: number) {
    this.game = game;
    this.cardName = cardName;
    this.cardNumber = cardNumber;
    this.isShowing = false;
    this.isMatched = false;
    this.card = game.add
      .image(position.x, position.y, "cardDown")
      .setInteractive({ cursor: 'pointer' });

    this.card.setDisplaySize(CARD_WIDTH, CARD_HEIGHT);

    this.card.on('pointerdown', () => {
      const { deck } = game.objects;
      const cardShownCount = getShownCardCount(deck);
      if (cardShownCount >= 2) return;
      this.show();
    });
  }

  show = () => {
    const { card } = this;
    card.setTexture(this.cardName);
    card.setDisplaySize(CARD_WIDTH, CARD_HEIGHT);
    this.isShowing = true;
    // TODO: add flip animation
  };

  reset = () => {
    const { card, isMatched } = this;
    if (isMatched) return;
    // TODO: add flip animation
    setTimeout(() => {
      this.isShowing = false;
      card.setTexture("cardDown");
      card.setDisplaySize(CARD_WIDTH, CARD_HEIGHT);
    }, 1500);
  };

  matched = () => {
    const { game, card } = this;
    this.isMatched = true;
    this.isShowing = false;

    game.tweens.add({
      targets: card,
      alpha: 0,
      duration: 2000,
      ease: 'Power2'
    });

    setTimeout(() => {
      card.destroy();
    }, 2500);
  };
}
