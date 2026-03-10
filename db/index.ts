import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import "dotenv/config";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
  // 增加穩定性
  connect_timeout: 10,
  // 避免 Vercel 殭屍連線佔滿 Supabase 配額
  idle_timeout: 20,
});

export const db = drizzle(client, { schema });
