import * as tf from '@tensorflow/tfjs-node-gpu';
import {
  Tile,
  Problem2Input,
  Problem2Output
} from '..';

type Input = number[][][];
type Output = number[];

const learningRate = 0.001;
const batchSize = 64;
const numEpochs = 5;

export default class NnBasic {
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
  private convert(problemInput: Problem2Input) {
    const input = [] as Input;
    for (let i = 0; i < this.height; i++) {
      input[i] = [];
      for (let j = 0; j < this.width; j++) {
        input[i][j] = [0, 0];
        if (problemInput[i][j] === Tile.X) {
          input[i][j][0] = 1;
        }
        if (problemInput[i][j] === Tile.O) {
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
    problemInputs: Problem2Input[],
    problemOutputs: Problem2Output[]
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
    problemInputs: Problem2Input[]
  ) {
    const inputs = problemInputs.map(
      problemInput => this.convert(problemInput)
    );
    const inputsTensor = tf.tensor4d(inputs);
    const outputsTensor = this.model.predict(inputsTensor) as tf.Tensor2D;

    const outputs = await outputsTensor.array();
    
    inputsTensor.dispose();
    outputsTensor.dispose();

    return outputs;
  }
};
