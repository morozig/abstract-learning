import Problem from '../../interfaces/problem';
import { randomOf } from '../../lib/helpers';
import {
  PlaneSymmetry,
  board as planeBoard,
  point as planePoint
} from '../../lib/transforms';
import { getWinner2D } from '../../lib/xos';

export enum Tile {
  Empty,
  X,
  O
}
export type Problem4Input = Tile[][];
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
  private isOneMoveLeft(board: Tile[][]) {
    const availables = this.availablePoints(board);
    if (!availables.length) {
      return false;
    }
    const hasEnded = getWinner2D(board, 4);
    if (hasEnded) {
      return false;
    }
    const winningMoves = availables.filter(move => {
      const newBoard = this.copyBoard(board);
      newBoard[move.i][move.j] = 
      return getWinner2D(newBoard, 4);
    });
    return winningMoves.length === 1;
  }
  private playRandomGame() {
    const board = this.emptyBoard();
    const history = [] as {
      action: number;
      board: Tile[][];
      playerIndex: number;
    }[];

    let winner = 0;
    let playerIndex = 0;

    while (
      !winner &&
      history.length < this.height * this.width
    ) {
      const availables = this.availablePoints(board);
      const point = randomOf(availables);
      const action = this.pointToAction(point);
      history.push({
        action,
        board: this.copyBoard(board),
        playerIndex
      });

      board[point.i][point.j] = this.playerTile(
        playerIndex
      );
      playerIndex = 1 - playerIndex;
      winner = getWinner2D(board, 4);
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
      if (randomHistory.length < this.height * this.width) {
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

    const input = state.board;
    const action = state.action;
    const output = new Array<number>(this.width * this.height)
      .fill(0);
    output[action - 1] = 1;

    const pair = [input, output] as Problem4Pair;
    return pair;
  }
  generateTrainigData(count: number) {
    const trainingData = [] as Problem4Pair[];
    for (let n = 0; n < count; n++) {
      const pair = this.generateTrainingExample(false);
      trainingData.push(pair);
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
