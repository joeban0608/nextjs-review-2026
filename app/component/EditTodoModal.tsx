// app/component/EditTodoModal.tsx
"use client";

import { useRef } from "react";
import { updateTodo } from "@/app/lib/action";
import { InsertTodo } from "@/db/schema";

export default function EditTodoModal({ todo }: { todo: InsertTodo }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();
  if (!todo.id) {
    throw new Error("Missing id when delete todo Item.");
  }
  const todoId = todo.id;
  // 封裝 Action，執行完後自動關閉視窗
  async function handleUpdate(formData: FormData) {
    await updateTodo(todoId, formData);
    closeModal();
  }

  return (
    <>
   <button
  onClick={openModal}
  className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors cursor-pointer"
  title="Edit Task"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 這是 Lucide 的 Pencil 圖示 */}
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
</button>

      <dialog
        ref={dialogRef}
        className="m-auto p-0 rounded-xl shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm border-none w-[calc(100%-2rem)] max-w-md overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-900">Edit Todo</h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-black"
            >
              ✕
            </button>
          </div>

          <form action={handleUpdate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">
                Title
              </label>
              <input
                name="title"
                defaultValue={todo.title}
                required
                className="border border-slate-200 p-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={todo.description ?? ""}
                className="border border-slate-200 p-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[100px]"
              />
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
