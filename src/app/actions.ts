"use server";

import { get, set } from "../../utils/redis/sessionStore";

export async function cacheSummaryMarkdown(client: string, markdown: string) {
  await set(client, markdown);
}

export async function retreiveSummaryMarkdown(client: string): Promise<string> {
  const retreived = await get(client);

  return retreived as string;
}
