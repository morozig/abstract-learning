export type ProblemPair<I,O> = [I, O];

export default interface Problem<I,O> {
  generateTrainigData(
    count: number
  ): ProblemPair<I,O>[];
  generateTestData(
    count: number
  ): ProblemPair<I,O>[];
};
