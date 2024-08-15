import OpenAI from "openai";

const openai = new OpenAI();

export const getGPTResponse = async (systemMessage: string) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: systemMessage }],
  });

  return completion.choices[0].message;
};
