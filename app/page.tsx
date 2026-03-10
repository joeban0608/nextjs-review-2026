import { addTodo, deleteTodo, getTodoList } from "@/app/lib/action";
import Link from "next/link"; // 建議換成 Link 避免全頁刷新

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const { page: pageRaw } = await searchParams;
  const page = Math.max(1, Number(pageRaw ?? "1")); // 確保頁數不會小於 1

  const { todos, hasNextPage } = await getTodoList(page);
  return (
    <section className="flex flex-col items-center justify-center min-h-screen gap-2">
      <h1 className="text-2xl font-bold">Todo List</h1>

      <form action={addTodo} className="flex flex-col gap-2 w-80 border-2 p-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          required
          className="border p-2"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          className="border p-2"
        />
        <button type="submit" className="bg-black text-white p-2 rounded">
          Add
        </button>
      </form>

      <ul className="mt-2 py-2 px-4 min-w-[300px] border-2 gap-2">
        {todos.map((todo) => (
          <li key={todo.id} className="border-b last:border-0 py-2">
            {todo.completed ? "✅" : "📌"} - <strong>{todo.title}</strong>
            <p className="text-sm text-gray-600">{todo.description}</p>
            <span className="text-xs text-gray-400">
              {new Date(todo.updatedAt).toLocaleString()}
            </span>
            {/* 刪除表單 */}
            <form
              className="mt-2"
              action={async () => {
                "use server"; // 在 Next.js 16 中，可以直接在 action 內定義或引用
                await deleteTodo(todo.id);
              }}
            >
              <button
                type="submit"
                className="text-red-500 hover:text-red-700 text-sm border border-red-200 px-2 py-1 rounded"
              >
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>

      {/* Pagination: 使用 Link 以獲得更好的效能 */}
      <div className="flex gap-4 items-center mt-2">
        {/* Prev 按鈕 */}
        {page > 1 ? (
          <Link href={`/?page=${page - 1}`} className="border px-4 py-1">
            Prev
          </Link>
        ) : (
          <span className="border px-4 py-1 opacity-30 cursor-not-allowed">
            Prev
          </span>
        )}

        <span>Page {page}</span>

        {/* Next 按鈕：根據 hasNextPage 判斷 */}
        {hasNextPage ? (
          <Link href={`/?page=${page + 1}`} className="border px-4 py-1">
            Next
          </Link>
        ) : (
          <span className="border px-4 py-1 opacity-30 cursor-not-allowed">
            Next
          </span>
        )}
      </div>
    </section>
  );
}
