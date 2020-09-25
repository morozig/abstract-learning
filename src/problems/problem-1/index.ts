import Problem from '../../interfaces/problem';

export enum Tile {
  Empty,
  X,
  O
}
export type Problem1Input = Tile[][];
export type Problem1Output = number[];
export type Problem1Pair = [Problem1Input, Problem1Output];

interface Point {
  i: number;
  j: number;
};

export default class Problem1
  implements Problem<Problem1Input, Problem1Output>
{
  private height = 5;
  private width = 5;
  private targetsCount = 4;
  private testAction = 12;
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
  private generateTrainingExampe(xAction: number) {
    const allActions = new Array(this.width * this.height)
      .fill(0)
      .map((_, index) => index + 1);
    const xPoint = this.actionToPoint(xAction);
    const allOActions = allActions
      .slice()
      .filter(action => action !== xAction);
    allOActions.sort(() => Math.random() - 0.5);
    const oActions = allOActions.slice(0, this.targetsCount - 1);
    const oPoints = oActions.map((action) => this.actionToPoint(action));

    const input = this.emptyBoard();
    input[xPoint.i][xPoint.j] = Tile.X;
    for (let oPoint of oPoints) {
      input[oPoint.i][oPoint.j] = Tile.O;
    }

    const output = new Array<number>(this.width * this.height)
      .fill(0);
    output[xAction - 1] = 1;

    const pair = [input, output] as Problem1Pair;
    return pair;
  }
  generateTrainigData(count: number) {
    const trainingData = [] as Problem1Pair[];
    for (let n = 0; n < count; n++) {
      const allActions = new Array(this.width * this.height)
        .fill(0)
        .map((_, index) => index + 1);
      const allXActions = allActions
        .slice()
        .filter(action => action !== this.testAction);
      allXActions.sort(() => Math.random() - 0.5);
      const xAction = allXActions[0];
      const pair = this.generateTrainingExampe(xAction);
      trainingData.push(pair);
    }
    return trainingData;
  }
  generateTestData(count: number) {
    const testData = [] as Problem1Pair[];
    for (let n = 0; n < count; n++) {
      const pair = this.generateTrainingExampe(this.testAction);
      testData.push(pair);
    }
    return testData;
  }
};
