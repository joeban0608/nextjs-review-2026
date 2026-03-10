import { addTodo, getTodoList, toggleTodo } from "@/app/lib/action";
import Link from "next/link"; // 建議換成 Link 避免全頁刷新
import ConfirmDeleteModal from "@/app/component/ConfirmDeleteModal";
import EditTodoModal from "@/app/component/EditTodoModal";

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

      <ul className="mt-2 py-2 px-4 min-w-[400px] border-2 gap-2">
        {todos.map((todo) => (
          <li key={todo.id} className="border-b last:border-0 py-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                {/* 1. Toggle 按鈕：點擊圖示切換狀態 */}
                <form action={toggleTodo.bind(null, todo.id, !!todo.completed)}>
                  <button
                    type="submit"
                    className={`
      flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer
      ${
        todo.completed
          ? "bg-green-100 hover:bg-green-200 border-green-200"
          : "bg-red-50 hover:bg-red-100 border-red-200"
      }
      border shadow-sm hover:scale-110 active:scale-95
    `}
                    title={
                      todo.completed
                        ? "Mark as uncompleted"
                        : "Mark as completed"
                    }
                  >
                    <span className="text-xl">
                      {todo.completed ? "✅" : "📌"}
                    </span>
                  </button>
                </form>

                <div
                  className={todo.completed ? "line-through text-gray-400" : ""}
                >
                  <strong className="block text-lg">{todo.title}</strong>
                  <p className="text-sm">{todo.description}</p>
                </div>
              </div>

              {/* 刪除 ,編輯 按鈕  */}
              <div className="flex items-center gap-1">
                <EditTodoModal todo={todo} />
                <ConfirmDeleteModal id={todo.id} title={todo.title} />
              </div>
            </div>

            <div className="mt-2 text-[10px] text-gray-400">
              Last updated: {new Date(todo.updatedAt).toLocaleString()}
            </div>
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
