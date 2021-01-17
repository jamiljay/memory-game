import {
  TEXT_STYLE
} from "../constants";

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

export default class Timer {
  readonly timer: any;
  constructor(game: any) {
    this.timer = game.add.text(0, 0, `Time: 0s`, TEXT_STYLE);
    this.timer.setData("time", 0);
    this.timer.setData("formatedTime", '0s');

    this.start();
  }

  getTime = () => {
    const { timer } = this;
    return timer.getData("formatedTime");
  }

  start = () => {
    const { timer } = this;
    timer.interval = setInterval(() => {
      let time: number = timer.getData("time");
      const formatedTime = formatTime(++time);
      timer.setText(`Time: ${formatedTime}`);

      timer.setData("time", time);
      timer.setData("formatedTime", formatedTime);
    }, 1000);
  }

  stop = () => {
    const { interval } = this.timer;
    clearInterval(interval);
  }

  destroy = () => {
    const { timer } = this;
    timer.destroy();
  }
}