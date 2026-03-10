"use server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";
import { desc } from "drizzle-orm"; // 記得匯入 desc
import { redirect } from "next/navigation";

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

  // 告訴 Next.js 重新驗證首頁路徑，這樣列表才會更新
  revalidatePath("/");
  redirect("/");
  console.log("todo", todo);
}

const PAGE_SIZE = 3;

export async function getTodoList(page: number) {
  const offset = (page - 1) * PAGE_SIZE;

  // 1. 取得資料，並加上 desc 排序
  const todoList = await db
    .select()
    .from(schema.todos)
    .orderBy(desc(schema.todos.id)) // 或者使用 schema.todos.createdAt
    .limit(PAGE_SIZE)
    .offset(offset);

  // 2. 取得總筆數 (維持不變)
  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.todos);

  const totalCount = Number(countResult.count);
  const hasNextPage = offset + PAGE_SIZE < totalCount;

  return {
    todos: todoList,
    hasNextPage,
  };
}

export async function deleteTodo(id: number) {
  try {
    await db.delete(schema.todos).where(eq(schema.todos.id, id));
    
    // 刪除後刷新頁面數據
    revalidatePath("/");
  } catch (error) {
    console.error("Delete Error:", error);
    throw new Error("Failed to delete todo");
  }
}


// 1. 切換完成狀態
export async function toggleTodo(id: number, currentStatus: boolean) {
  await db.update(schema.todos)
    .set({ completed: !currentStatus })
    .where(eq(schema.todos.id, id));
  
  revalidatePath("/");
}

// 2. 更新文字內容
export async function updateTodo(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  await db.update(schema.todos)
    .set({ title, description, updatedAt: new Date() })
    .where(eq(schema.todos.id, id));

  revalidatePath("/");
}