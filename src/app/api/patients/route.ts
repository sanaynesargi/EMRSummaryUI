import { type NextRequest } from "next/server";
import { db } from "../../../orm/database";

export async function GET(req: NextRequest) {
  const clients = await db
    .selectFrom("clients")
    .select(["clients.id", "clients.first_name", "clients.last_name"])
    .execute();

  return Response.json({ data: clients });
}
