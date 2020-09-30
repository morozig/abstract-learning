import Problem from '../../interfaces/problem';
import { randomOf } from '../../lib/helpers';
import {
  PlaneSymmetry,
  board as planeBoard,
  point as planePoint
} from '../../lib/transforms';
import { getWinner2D } from '../../lib/xos';
import ProgressBar from 'progress';

export enum Tile {
  Empty,
  X,
  O
}
export interface Problem4Input {
  playerIndex: number;
  board: Tile[][];
};
export type Problem4Output = number[];
export type Problem4Pair = [Problem4Input, Problem4Output];

interface Point {
  i: number;
  j: number;
};

export default class Problem4
  implements Problem<Problem4Input, Problem4Output>
{
  private height = 5;
  private width = 5;
  private testActions = [1, 6, 7, 11, 12, 13, 16];
  private actionToPoint(action: number) {
    const i = Math.floor((action - 1) / this.width);
    const j = (action - 1) % this.width;
    return { i, j } as Point;
  }
  private pointToAction(point: Point) {
    const { i, j } = point;
    const action = i * this.width + j + 1;
    return action;
  }
  private emptyBoard() {
    const board = [] as Tile[][];
    for (let i = 0; i < this.height; i++) {
      board[i] = [];
      for (let j = 0; j < this.width; j++) {
        board[i][j] = Tile.Empty;
      }
    }
    return board;
  }
  private copyBoard(prev: Tile[][]) {
    const board = prev.map(
      row => row.slice()
    );
    return board;
  }
  private playerTile(playerIndex: number) {
    switch (playerIndex) {
      case (0): {
        return Tile.X;
      }
      case (1): {
        return Tile.O;
      }
      default: {
        return Tile.Empty;
      }
    }
  }
  private availablePoints(board: Tile[][]) {
    const availables = [] as Point[];
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (board[i][j] === Tile.Empty) {
          availables.push({ i, j });
        }
      }
    }
    return availables;
  }
  private getWinningMove(state: Problem4Input) {
    const { board, playerIndex } = state;
    const availables = this.availablePoints(board);
    if (!availables.length) {
      return 0;
    }
    const hasEnded = getWinner2D(board, 4);
    if (hasEnded) {
      return 0;
    }
    const winningMoves = availables.filter(move => {
      const newBoard = this.copyBoard(board);
      newBoard[move.i][move.j] = this.playerTile(playerIndex);
      return getWinner2D(newBoard, 4);
    });
    if (winningMoves.length === 1) {
      return this.pointToAction(winningMoves[0]);
    } else {
      return 0;
    }
  }
  private playRandomGame() {
    const history = [] as {
      action: number;
      board: Tile[][];
      playerIndex: number;
    }[];

    const state = {
      board: this.emptyBoard(),
      playerIndex: 0
    };

    let winner = 0;

    while (
      !winner &&
      history.length < this.height * this.width
    ) {
      let action = this.getWinningMove(state);
      if (!action) {
        const availables = this.availablePoints(state.board);
        const point = randomOf(availables);
        action = this.pointToAction(point);
      }
      history.push({
        action,
        board: this.copyBoard(state.board),
        playerIndex: state.playerIndex
      });
      const point = this.actionToPoint(action);
      state.board[point.i][point.j] = this.playerTile(
        state.playerIndex
      );
      state.playerIndex = 1 - state.playerIndex;
      winner = getWinner2D(state.board, 4);
    }
    return history;
  }
  private generateTrainingExample(isTest: boolean) {
    let history = [] as {
      action: number;
      board: Tile[][];
      playerIndex: number;
    }[];

    while (!history.length) {
      const randomHistory = this.playRandomGame();
      if (
        randomHistory.length < this.height * this.width &&
        this.getWinningMove(randomHistory[randomHistory.length - 1])
      ) {
        history = randomHistory;
      }
    }
    const state = history[history.length - 1];

    if (!isTest) {
      if (this.testActions.includes(state.action)) {
        const sym = randomOf([
          PlaneSymmetry.Rotation90,
          PlaneSymmetry.Rotation180,
          PlaneSymmetry.Rotation270
        ]);
        const point = planePoint({
          height: this.height,
          width: this.width,
          ...this.actionToPoint(
            state.action
          ),
          sym
        })
        state.action = this.pointToAction(
          point
        );
        state.board = planeBoard(
          state.board,
          sym
        );
      }
    } else {
      while(!this.testActions.includes(state.action)) {
        const sym = PlaneSymmetry.Rotation90;
        const point = planePoint({
          height: this.height,
          width: this.width,
          ...this.actionToPoint(
            state.action
          ),
          sym
        })
        state.action = this.pointToAction(
          point
        );
        state.board = planeBoard(
          state.board,
          sym
        );
      }
    }

    const input = {
      board: state.board,
      playerIndex: state.playerIndex
    };
    const action = state.action;
    const output = new Array<number>(this.width * this.height)
      .fill(0);
    output[action - 1] = 1;

    const pair = [input, output] as Problem4Pair;
    return pair;
  }
  generateTrainigData(count: number) {
    const trainingData = [] as Problem4Pair[];
    const bar = new ProgressBar(
      '[:bar] :percent :etas', {
        width: 20,
        total: count
      }
    );
    for (let n = 0; n < count; n++) {
      const pair = this.generateTrainingExample(false);
      trainingData.push(pair);
      bar.tick();
    }
    return trainingData;
  }
  generateTestData(count: number) {
    const testData = [] as Problem4Pair[];
    for (let n = 0; n < count; n++) {
      const pair = this.generateTrainingExample(true);
      testData.push(pair);
    }
    return testData;
  }
};
