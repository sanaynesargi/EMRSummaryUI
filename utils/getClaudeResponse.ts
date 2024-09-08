// import Anthropic from "@anthropic-ai/sdk";

// const anthropic = new Anthropic();

// // export const getClaudeResponse = async (
// //   systemMessage: string,
// //   isLargeMessage: boolean
// // ) => {
// //   const msg = await anthropic.messages.create({
// //     model: isLargeMessage
// //       ? "claude-3-haiku-20240307"
// //       : "claude-3-5-sonnet-20240620",
// //     messages: [{ role: "user", content: systemMessage }],
// //     max_tokens: 1000,
// //   });

// //   const content: any = msg.content[0];

// //   return content.text;
// // };
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export const getClaudeResponse = async (systemMessage: string) => {
  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    messages: [{ role: "user", content: systemMessage }],
    max_tokens: 1000,
  });

  const content: any = msg.content[0];

  return content.text;
};
