import { AutoTokenizer } from "@xenova/transformers";

export const countTokens = async (message: string) => {
  const tokenizer = await AutoTokenizer.from_pretrained("Xenova/gpt-4o");
  const tokens = tokenizer.encode(message);

  return tokens.length;
};
