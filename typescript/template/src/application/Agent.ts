import { ILanguageModel } from "./ILanguageModel.js";

export class Agent {
  constructor(private model: ILanguageModel) {}

  async run(): Promise<void> {
    throw new Error("Not implemented");
  }
}
