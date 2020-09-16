import Problem from './problems/problem-1';
import Model from './problems/problem-1/models/nn-basic';

const run = async () => {
  const problem = new Problem();
  const trainingData = problem.generateTrainigData(100000);
  console.log('Training Data');
  for (let pair of trainingData.slice(0, 3)) {
    console.log(pair[0], pair[1]);
  }
  const testData = problem.generateTestData(100);

  const model = new Model();
  const result0 = await model.predict(
    testData.map(pair => pair[0])
  );
  console.log('Test Example Before Training');
  console.log(testData[0][0], result0[0]);

  await model.fit(
    trainingData.map(pair => pair[0]),
    trainingData.map(pair => pair[1])
  );
  const result1 = await model.predict(
    testData.map(pair => pair[0])
  );

  console.log('Test Example After Training');
  console.log(testData[0][0], result1[0]);
};

run();