import {
  GAME_BOARD_WIDTH,
  CARD_WIDTH,
  CARD_HEIGHT,
  TEXT_STYLE,
  BUTTON_STYLE
} from "./constants";

export function addStartButton(game: any) {
  return game.add
    .text(GAME_BOARD_WIDTH / 2, 350, 'Start Game!', BUTTON_STYLE)
    .setOrigin(.5, .5)
    .setShadow( 1, 1, '#4168fc')
    .setInteractive({ cursor: 'pointer' });
}

export function addRestartButton(game: any) {
  return game.add
    .text(GAME_BOARD_WIDTH / 2, 350, 'Click to Play Again!', BUTTON_STYLE)
    .setOrigin(.5, .5)
    .setShadow( 1, 1, '#4168fc')
    .setInteractive({ cursor: 'pointer' });
}

function formatTime(time: number): string {
  let seconds = time;
  const hours = Math.floor(seconds / 3600);
  seconds = seconds - (hours * 3600);
  const minutes = Math.floor(seconds / 60);
  seconds = seconds - (minutes * 60);

  if (hours) return 'Maybe you need help :(';
  if (minutes) return `${minutes}m:${seconds}s`;
  return `${seconds}s`;
}

export function addTimer(game: any) {
  const scoreText: any = game.add.text(0, 0, `Time: 0s`, TEXT_STYLE);
  scoreText.setData("time", 0);
  scoreText.setData("formatedTime", '0s');

  const interval = setInterval(() => {
    let time: number = scoreText.getData("time");
    const formatedTime = formatTime(++time);
    scoreText.setText(`Time: ${formatedTime}`);

    scoreText.setData("time", time);
    scoreText.setData("formatedTime", formatedTime);
  }, 1000);

  scoreText.setData("interval", interval);

  return scoreText;
}

interface Position {
  x: number,
  y: number
};

export function createCard(game: any, position: Position, cardName: string, cardNumber: number): any {
  const card = game.add
    .image(position.x, position.y, "cardDown")
    .setInteractive({ cursor: 'pointer' });

  card.setDisplaySize(CARD_WIDTH, CARD_HEIGHT);

  card.setData("cardNumber", cardNumber);
  card.setData("cardName", cardName);
  card.setData("isShowing", false);

  return card;
}

export function processCardClick(allCards: Array<any>, card: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const cardShownCount = allCards.reduce((count, c) => {
      return c.getData("isShowing") ? ++count : count;
    }, 0);
    const shownCard = allCards.find((c) => c.getData("isShowing"));
    const isCardMatch = shownCard && shownCard.getData("cardName") === card.getData("cardName");
    const isNotSameCard = shownCard && shownCard.getData("cardNumber") !== card.getData("cardNumber")

    // Wait for shown cards to finish
    if (cardShownCount >= 2) {
      resolve();
      return;
    }

    card.setTexture(card.getData("cardName"));
    card.setDisplaySize(CARD_WIDTH, CARD_HEIGHT);
    card.setData("isShowing", true);

    // Cards matched
    if (shownCard && isCardMatch && isNotSameCard) {
      setTimeout(() => {
        shownCard.destroy();
        card.destroy();
        resolve();
      }, 500);

      // Cards not matched - reset
    } else if (shownCard && isNotSameCard) {
      setTimeout(() => {
        shownCard.setData("isShowing", false);
        shownCard.setTexture("cardDown");
        shownCard.setDisplaySize(CARD_WIDTH, CARD_HEIGHT);

        card.setData("isShowing", false);
        card.setTexture("cardDown");
        card.setDisplaySize(CARD_WIDTH, CARD_HEIGHT);
        resolve();
      }, 1500);
    }
  });
}
