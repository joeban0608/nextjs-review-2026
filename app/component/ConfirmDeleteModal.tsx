// app/components/ConfirmDeleteModal.tsx
"use client";

import { useRef, useState } from "react";
import { deleteTodo } from "@/app/lib/action";

export default function ConfirmDeleteModal({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [userInput, setUserInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const expectedString = `${id}:${title}`;
  const isMatch = userInput === expectedString;

  const openModal = () => {
    setUserInput(""); // 打開時清空
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  const handleDelete = async () => {
    if (!isMatch) return;
    setIsDeleting(true);
    try {
      await deleteTodo(id);
      closeModal();
    } catch (error) {
      alert("刪除失敗");
      console.error(`Something wrong when delete todo: \n${JSON.stringify(error)}`)
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* 觸發按鈕 */}
      <button
        onClick={openModal}
        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
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
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>

      {/* Modal 本體 */}
      <dialog
        ref={dialogRef}
        className="m-auto p-0 rounded-xl shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm border-none w-[calc(100%-2rem)] max-w-md overflow-hidden"
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900">
            確認刪除這項任務？
          </h3>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            確認要刪除，請在下方輸入{" "}
            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border text-red-600 font-bold">
              {expectedString}
            </span>{" "}
            以確認刪除。
          </p>

          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="輸入確認字串"
            className="w-full mt-4 p-3 border-2 border-slate-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors font-mono text-sm"
          />

          <div className="mt-6 flex gap-3">
            <button
              onClick={closeModal}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              onClick={handleDelete}
              disabled={!isMatch || isDeleting}
              className={`flex-1 px-4 py-2 rounded-lg font-bold transition-all ${
                isMatch && !isDeleting
                  ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isDeleting ? "刪除中..." : "確認刪除"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
