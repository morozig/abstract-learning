import Problem from '../../interfaces/problem';

export enum Tile {
  Empty,
  X,
  O
}
export type Problem2Input = Tile[][];
export type Problem2Output = number[];
export type Problem2Pair = [Problem2Input, Problem2Output];

interface Point {
  i: number;
  j: number;
};

export default class Problem2
  implements Problem<Problem2Input, Problem2Output>
{
  private height = 5;
  private width = 5;
  private testActions = [5, 10, 15, 20, 25];
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
  private noisyBoard() {
    const board = [] as Tile[][];
    for (let i = 0; i < this.height; i++) {
      board[i] = [];
      for (let j = 0; j < this.width; j++) {
        board[i][j] = [
          Tile.Empty, Tile.Empty, Tile.Empty, Tile.X, Tile.O
        ][Math.floor(Math.random() * 5)];
      }
    }
    return board;
  }
  private generateTrainingExampe(action: number) {
    const point = this.actionToPoint(action);
    const input = this.noisyBoard();
    for (let j = 0; j < this.width; j++) {
      input[point.i][j] = Tile.X;
    }
    input[point.i][point.j] = Tile.Empty;
    const output = new Array<number>(this.width * this.height)
      .fill(0);
    output[action - 1] = 1;

    const pair = [input, output] as Problem2Pair;
    return pair;
  }
  generateTrainigData(count: number) {
    const trainingData = [] as Problem2Pair[];
    for (let n = 0; n < count; n++) {
      const allActions = new Array(this.width * this.height)
        .fill(0)
        .map((_, index) => index + 1);
      const trainActions = allActions
        .filter(action => !this.testActions.includes(action));
      const action = trainActions[
        Math.floor(Math.random() * trainActions.length)
      ];
      const pair = this.generateTrainingExampe(action);
      trainingData.push(pair);
    }
    return trainingData;
  }
  generateTestData(count: number) {
    const testData = [] as Problem2Pair[];
    for (let n = 0; n < count; n++) {
      const action = this.testActions[
        Math.floor(Math.random() * this.testActions.length)
      ];
      const pair = this.generateTrainingExampe(action);
      testData.push(pair);
    }
    return testData;
  }
};
