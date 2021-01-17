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

export function addStartButton(game: any) {
  const startButton = game.add
    .text(GAME_BOARD_WIDTH / 2, 350, 'Start Game!', BUTTON_STYLE)
    .setOrigin(.5, .5)
    .setShadow( 1, 1, '#4168fc')
    .setInteractive({ cursor: 'pointer' });

  game.objects.startButton = startButton;
}

function addRestartButton(game: any) {
  const restartButton = game.add
    .text(GAME_BOARD_WIDTH / 2, 350, 'Click to Play Again!', BUTTON_STYLE)
    .setOrigin(.5, .5)
    .setShadow( 1, 1, '#4168fc')
    .setInteractive({ cursor: 'pointer' });

  game.objects.restartButton = restartButton;
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

function addTimer(game: any) {
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

  game.objects.scoreText = scoreText;
}

interface Position {
  x: number,
  y: number
};

function getShownCardCount(deck: Array<any>) {
  return deck.reduce((count: number, c: any) => {
    return c.getData("isShowing") ? ++count : count;
  }, 0);
}

function createCard(game: any, position: Position, cardName: string, cardNumber: number): any {
  const card = game.add
    .image(position.x, position.y, "cardDown")
    .setInteractive({ cursor: 'pointer' });

  card.setDisplaySize(CARD_WIDTH, CARD_HEIGHT);

  card.setData("cardNumber", cardNumber);
  card.setData("cardName", cardName);
  card.setData("isShowing", false);

  card.show = function () {
    card.setTexture(card.getData("cardName"));
    card.setDisplaySize(CARD_WIDTH, CARD_HEIGHT);
    card.setData("isShowing", true);
    // TODO: add flip animation
  };

  card.reset = function () {
    // TODO: add flip animation
    setTimeout(() => {
      card.setData("isShowing", false);
      card.setTexture("cardDown");
      card.setDisplaySize(CARD_WIDTH, CARD_HEIGHT);
    }, 1500);
  };

  card.matched = function () {
    card.setData("isShowing", false);
    // TODO: add match animation
    setTimeout(() => {
      card.destroy();
    }, 1000);
  };

  card.on('pointerdown', () => {
    const { deck } = game.objects;
    const cardShownCount = getShownCardCount(deck);
    if (cardShownCount >= 2) return;
    card.show();
  });

  return card;
}

export function checkforMatch(game: any) {
  const { deck } = game.objects;
  const shownCards = deck.filter((c:any) => c.getData("isShowing"));
  const is2CardsShown = shownCards.length >= 2;
  const isCardMatch = is2CardsShown && shownCards[0].getData("cardName") === shownCards[1].getData("cardName");

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
  deck.forEach((card: any) => { isAllMatched = isAllMatched && !card.active; });
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

export function gameStart(game: any) {
  let count = 0;
  let cardPostions = [];
  game.objects.deck = [];

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
    const card1 = createCard(game, cardPostions[i], `card${cardNumber}`, i);
    const card2 = createCard(game, cardPostions[i + 12], `card${cardNumber}`, i + 12);

    game.objects.deck.push(card1);
    game.objects.deck.push(card2);
  }

  addTimer(game);
  game.state.isGameRunning = true;
}

export function gameEnd(game: any) {
  const { timer } = game.objects;
  clearInterval(timer.getData("interval"));
  const time = timer.getData("formatedTime");

  const completeText = game.add
    .text(GAME_BOARD_WIDTH / 2, 150, `Memory Game Completed in ${time}!!`, { ...TEXT_STYLE, fontSize: "24px" })
    .setOrigin(.5, .5);

  const restartButton: any = addRestartButton(game);
  restartButton.on('pointerdown', () => {
    completeText.destroy();
    restartButton.destroy();
    timer.destroy();
    gameStart(game);
  });

  game.state.isGameRunning = false;
}
