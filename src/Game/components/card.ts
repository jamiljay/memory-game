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
    return c.isShowing && !c.isMatched ? ++count : count;
  }, 0);
}

export default class Card {
  game: any
  cardName: string
  cardNumber: number
  isShowing: boolean
  isMatched: boolean
  card: any
  cardface: any
  constructor(game: any, position: Position, cardName: string, cardNumber: number) {
    this.game = game;
    this.cardName = cardName;
    this.cardNumber = cardNumber;
    this.isShowing = false;
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
    this.card.setVisible(false);
    this.cardface.setVisible(true);
    // TODO: add flip animation
  };

  reset = () => {
    if (this.isMatched) return;
    // TODO: add flip animation
    setTimeout(() => {
      this.isShowing = false;
      this.card.setVisible(true);
      this.cardface.setVisible(false);
    }, 1500);
  };

  matched = () => {
    const { game, card, cardface } = this;
    this.isMatched = true;
    this.isShowing = false;

    game.tweens.add({
      targets: cardface,
      alpha: 0,
      duration: 2000,
      ease: 'Power2'
    });

    setTimeout(() => {
      card.destroy();
      cardface.destroy();
    }, 2500);
  };
}
