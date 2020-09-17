export enum Tile {
  Empty,
  X,
  O
}
export type Problem3Input = Tile[][];
export type Problem3Output = number[];
export type Problem3Pair = [Problem3Input, Problem3Output];

interface Point {
  i: number;
  j: number;
};

export default class Problem3 {
  private height = 5;
  private width = 5;
  private testActions = [1, 2, 3, 4, 5];
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
          Tile.X, Tile.O
        ][Math.floor(Math.random() * 2)];
      }
    }
    return board;
  }
  private generateTrainingExampe(actions: number[]) {
    const input = this.noisyBoard();
    const output = new Array<number>(this.width * this.height)
      .fill(0);
    for (let action of actions) {
      const point = this.actionToPoint(action);
      input[point.i][point.j] = Tile.Empty;
      output[action - 1] = 1 / actions.length;
    }
    const pair = [input, output] as Problem3Pair;
    return pair;
  }
  generateTrainigData(count: number) {
    const trainingData = [] as Problem3Pair[];
    for (let n = 0; n < count; n++) {
      const allActions = new Array(this.width * this.height)
        .fill(0)
        .map((_, index) => index + 1);
      const trainActions = allActions
        .filter(action => !this.testActions.includes(action));
      trainActions.sort(() => Math.random() - 0.5);
      const actionsCount = Math.floor(Math.random() * 4) + 3;
      const actions = trainActions.slice(0, actionsCount);
      const pair = this.generateTrainingExampe(actions);
      trainingData.push(pair);
    }
    return trainingData;
  }
  generateTestData(count: number) {
    const testData = [] as Problem3Pair[];
    for (let n = 0; n < count; n++) {
      const allActions = new Array(this.width * this.height)
        .fill(0)
        .map((_, index) => index + 1);
      const testActions = allActions
        .filter(action => !this.testActions.includes(action));
      testActions.sort(() => Math.random() - 0.5);
      const actionsCount = Math.floor(Math.random() * 10) + 3;
      const actions = this.testActions.concat(
        testActions.slice(0, actionsCount)
      );
      const pair = this.generateTrainingExampe(actions);
      testData.push(pair);
    }
    return testData;
  }
};
