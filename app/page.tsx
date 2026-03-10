import { addTodo } from "@/app/lib/action";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Todo List</h1>

      <form action={addTodo} className="flex flex-col gap-2 w-80">
        <input
          type="text"
          name="title"
          placeholder="Add a new todo"
          required
          className="border p-2"
        />

        <input
          type="text"
          name="description"
          placeholder="Add a description about todo"
          className="border p-2"
        />

        <button type="submit" className="bg-black text-white p-2 rounded">
          Add
        </button>
      </form>

      {/* Todo list */}
      <ul className="mt-6">
        <li>Todo 1</li>
        <li>Todo 2</li>
        <li>Todo 3</li>
      </ul>
    </section>
  );
}
