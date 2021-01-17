import {
  GAME_BOARD_WIDTH,
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_ROWS,
  CARD_COLUMNS,
  CARD_SPACING,
  TEXT_STYLE,
  BUTTON_STYLE
} from "./constants";

import gameTimer from "./components/timer";
import Card from "./components/card";

export function createStartButton(game: any) {
  const startButton = game.add
    .text(GAME_BOARD_WIDTH / 2, 350, 'Start Game!', BUTTON_STYLE)
    .setOrigin(.5, .5)
    .setShadow( 1, 1, '#4168fc')
    .setInteractive({ cursor: 'pointer' });

  return startButton;
}

export function checkforMatch(game: any) {
  const { deck } = game.objects;
  const shownCards = deck.filter((c: any) => c.isShowing && !c.isMatched);
  const is2CardsShown = shownCards.length >= 2;
  const isCardMatch = is2CardsShown && shownCards[0].cardName === shownCards[1].cardName;

  if (!is2CardsShown) return;

  // Cards matched
  if (isCardMatch) {
    shownCards[0].matched();
    shownCards[1].matched();

  // Cards not matched - reset
  } else {
    shownCards[0].reset();
    shownCards[1].reset();
  }
}

export function isAllCardsMatched(game: any) {
  const { deck } = game.objects;
  let isAllMatched = true;
  deck.forEach((card: any) => { isAllMatched = isAllMatched && card.isMatched; });
  return isAllMatched;
}

// sourece: https://stackoverflow.com/a/6274381
function shuffle(a: Array<any>) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCardPositions() {
  let count = 0;
  const cardPostions = [];

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

  return shuffle(cardPostions);
}

export function gameStart(game: any) {
  const cardPostions = createCardPositions();
  game.objects.deck = [];

  for (let i = 0; i < 12; i++) {
    const cardNumber = i + 1;
    game.objects.deck.push(
      new Card(game, cardPostions[i], `card${cardNumber}`, i)
    );
    game.objects.deck.push(
      new Card(game, cardPostions[i + 12], `card${cardNumber}`, i + 12)
    );
  }

  game.objects.timer = new gameTimer(game);
  game.state.isGameRunning = true;
}

export function gameEnd(game: any) {
  const { timer } = game.objects;
  timer.stop();
  const time = timer.getTime();

  const completeText = game.add
    .text(GAME_BOARD_WIDTH / 2, 150, `Memory Game Completed in ${time}!!`, { ...TEXT_STYLE, fontSize: "24px" })
    .setOrigin(.5, .5);

  const restartButton = game.add
    .text(GAME_BOARD_WIDTH / 2, 350, 'Click to Play Again!', BUTTON_STYLE)
    .setOrigin(.5, .5)
    .setShadow(1, 1, '#4168fc')
    .setInteractive({ cursor: 'pointer' });
  
  restartButton.on('pointerdown', () => {
    completeText.destroy();
    restartButton.destroy();
    timer.destroy();
    gameStart(game);
  });

  game.state.isGameRunning = false;
}
