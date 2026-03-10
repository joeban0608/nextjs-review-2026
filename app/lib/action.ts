"use server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import z from "zod";

export async function addTodo(formData: FormData) {
  const title = formData.get("title");
  const description = formData.get("description");

  const originFormData = {
    title,
    description,
  };
  console.log(`origin form data: ${JSON.stringify(originFormData)}`);

  const todoZodSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
  });

  const parseResult = todoZodSchema.safeParse({
    title,
    description,
  });

  if (!parseResult.success) {
    console.error(`Error: ${JSON.stringify(parseResult.error, null, 2)}`);
    throw new Error("Insert todo params valid error");
  }
  console.log(`parseResult: ${JSON.stringify(parseResult.data)}`);

  const todo = await db.insert(schema.todos).values({
    title: parseResult.data.title,
    description: parseResult.data.description,
    completed: false,
  });

  console.log("todo", todo);
}
