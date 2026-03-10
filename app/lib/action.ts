"use server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";
import { desc } from "drizzle-orm"; // 記得匯入 desc
import { redirect } from "next/navigation";

export async function addTodo(formData: FormData) {
  // 1. 驗證數據 (保持不變)
  const title = formData.get("title");
  const description = formData.get("description");
  
  const todoZodSchema = z.object({
    title: z.string().min(1, "標題必填"),
    description: z.string().optional(),
  });

  const parseResult = todoZodSchema.safeParse({ title, description });

  if (!parseResult.success) {
    console.error('格式不正確')
    throw new Error('create todo data incorrect')
    // return { error: "格式不正確" }; // 返回錯誤對象而不是拋出，讓前端好處理
  }

  try {
    // 2. 資料庫操作
    await db.insert(schema.todos).values({
      title: parseResult.data.title,
      description: parseResult.data.description,
      completed: false,
    });

    // 3. 更新快取
    revalidatePath("/");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error('資料庫寫入失敗，請檢查連線')

    // return { error: "資料庫寫入失敗，請檢查連線" };
  }

  // 4. 跳轉 (一定要放在 try-catch 之外！)
  redirect("/");
}

const PAGE_SIZE = 3;

export async function getTodoList(page: number) {
  try {
    const offset = (page - 1) * PAGE_SIZE;

    // 1. 取得資料，並加上 desc 排序
    const todoList = await db
      .select()
      .from(schema.todos)
      .orderBy(desc(schema.todos.createdAt)) // 或者使用 schema.todos.createdAt
      .limit(PAGE_SIZE)
      .offset(offset);

    // 2. 取得總筆數 (維持不變)
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.todos);

    const totalCount = Number(countResult.count);
    const hasNextPage = offset + PAGE_SIZE < totalCount;

    return { todos: todoList, hasNextPage, error: null };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { todos: [], hasNextPage: false, error: "無法取得資料" };
  }
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
  await db
    .update(schema.todos)
    .set({ completed: !currentStatus })
    .where(eq(schema.todos.id, id));

  revalidatePath("/");
}

// 2. 更新文字內容
export async function updateTodo(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  await db
    .update(schema.todos)
    .set({ title, description, updatedAt: new Date() })
    .where(eq(schema.todos.id, id));

  revalidatePath("/");
}
