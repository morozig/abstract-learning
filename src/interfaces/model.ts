export default interface Model<I,O> {
  fit(
    problemInputs: I[],
    problemOutputs: O[]
  ): Promise<void>;
  predict(
    problemInputs: I[]
  ): Promise<O[]>;
  evaluate(
    problemInputs: I[],
    problemOutputs: O[]
  ): Promise<number>;
};
