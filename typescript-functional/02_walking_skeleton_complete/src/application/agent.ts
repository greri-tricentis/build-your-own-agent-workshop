export type Input = () => string;
export type Display = (text: string) => void;
export type Agent = (input: Input, display: Display) => void;

export const agent: Agent = (input: Input, display: Display) => {
  const message = input();
  display(`User: ${message}`);
};
