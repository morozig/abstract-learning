import * as tf from '@tensorflow/tfjs-node-gpu';
import {
  Tile,
  Problem4Input,
  Problem4Output
} from '..';
import Model from '../../../interfaces/model';

type Input = number[][][];
type Output = number[];

const learningRate = 0.001;
const batchSize = 64;
const numEpochs = 5;

export default class NnBasic
  implements Model<Problem4Input, Problem4Output>
{
  private model: tf.LayersModel;
  private height = 5;
  private width = 5;
  private depth = 2;
  private createModel() {
    const input = tf.input({
      shape: [this.height, this.width, this.depth]
    });

    let network = tf.layers.conv2d({
      kernelSize: 3,
      filters: 8,
      strides: 1,
      padding: 'same',
      useBias: false
    }).apply(input) as tf.SymbolicTensor;
    network = tf.layers.batchNormalization({
      axis: 3
    }).apply(network) as tf.SymbolicTensor;
    network = tf.layers.activation({
        activation: 'relu'
    }).apply(network) as tf.SymbolicTensor;

    network = tf.layers.conv2d({
      kernelSize: 3,
      filters: 8,
      strides: 1,
      padding: 'same',
      useBias: false
    }).apply(network) as tf.SymbolicTensor;
    network = tf.layers.batchNormalization({
      axis: 3
    }).apply(network) as tf.SymbolicTensor;
    network = tf.layers.activation({
        activation: 'relu'
    }).apply(network) as tf.SymbolicTensor;

    network = tf.layers.conv2d({
      kernelSize: 3,
      filters: 8,
      strides: 1,
      padding: 'same',
      useBias: false
    }).apply(network) as tf.SymbolicTensor;
    network = tf.layers.batchNormalization({
      axis: 3
    }).apply(network) as tf.SymbolicTensor;
    network = tf.layers.activation({
        activation: 'relu'
    }).apply(network) as tf.SymbolicTensor;

    network = tf.layers.conv2d({
      kernelSize: 3,
      filters: 1,
      strides: 1,
      padding: 'same',
      useBias: false
    }).apply(network) as tf.SymbolicTensor;
    network = tf.layers.batchNormalization({
      axis: 3
    }).apply(network) as tf.SymbolicTensor;
    network = tf.layers.activation({
        activation: 'relu'
    }).apply(network) as tf.SymbolicTensor;

    network = tf.layers.flatten(
    ).apply(network) as tf.SymbolicTensor;

    const output = tf.layers.softmax(
    ).apply(network) as tf.SymbolicTensor;

    const model = tf.model(
      {
        inputs: input,
        outputs: output
      }
    );
    return model;
  }
  private compile() {
    const optimizer = tf.train.adam(learningRate);

    this.model.compile({
      optimizer: optimizer,
      loss: 'categoricalCrossentropy',
      metrics: 'accuracy'
    });
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
  private convert(problemInput: Problem4Input) {
    const { board, playerIndex } = problemInput;
    const playerTile = this.playerTile(playerIndex);
    const enemyTile = this.playerTile(1 - playerIndex);
    const input = [] as Input;
    for (let i = 0; i < this.height; i++) {
      input[i] = [];
      for (let j = 0; j < this.width; j++) {
        input[i][j] = [0, 0];
        if (board[i][j] === playerTile) {
          input[i][j][0] = 1;
        }
        if (board[i][j] === enemyTile) {
          input[i][j][1] = 1;
        }
      }
    }
    return input;
  }
  constructor() {
    this.model = this.createModel();
    this.compile();
  }
  async fit(
    problemInputs: Problem4Input[],
    problemOutputs: Problem4Output[]
  ) {
    const inputs = problemInputs.map(
      problemInput => this.convert(problemInput)
    );
    const xsTensor = tf.tensor4d(inputs);
    const outputs = problemOutputs.slice();
    const ysTensor = tf.tensor2d(outputs);

    const trainingHistory = await this.model.fit(
      xsTensor,
      ysTensor,
      {
        batchSize,
        epochs: numEpochs,
        shuffle: true,
        validationSplit: 0.01,
        callbacks: {
          onEpochEnd: console.log
        }
      }
    );

    xsTensor.dispose();
    ysTensor.dispose();
    console.log(trainingHistory);
  }
  async predict(
    problemInputs: Problem4Input[]
  ) {
    const inputs = problemInputs.map(
      problemInput => this.convert(problemInput)
    );
    const inputsTensor = tf.tensor4d(inputs);
    const outputsTensor = this.model.predict(inputsTensor) as tf.Tensor2D;

    const outputs = await outputsTensor.array(
    ) as Problem4Output[];
    
    inputsTensor.dispose();
    outputsTensor.dispose();

    return outputs;
  }
  async evaluate(
    problemInputs: Problem4Input[],
    problemOutputs: Problem4Output[]
  ) {
    const inputs = problemInputs.map(
      problemInput => this.convert(problemInput)
    );
    const xsTensor = tf.tensor4d(inputs);
    const outputs = problemOutputs.slice();
    const ysTensor = tf.tensor2d(outputs);

    const [ lossTensor ] = this.model.evaluate(
      xsTensor,
      ysTensor
    ) as tf.Scalar[];

    const loss = await lossTensor.array();

    xsTensor.dispose();
    ysTensor.dispose();
    lossTensor.dispose();

    return loss;
  }
};
