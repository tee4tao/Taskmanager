import {
  type Todo,
  createTodo,
  type Priority,
  type Category,
} from "../types/todo";

// Simulating a backend service with localStorage
export const todoService = {
  getTodos: async (): Promise<Todo[]> => {
    return new Promise((resolve) => {
      const storedTodos = localStorage.getItem("todos");
      const todos = storedTodos ? JSON.parse(storedTodos) : [];

      // Convert string dates back to Date objects
      const parsedTodos = todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      }));

      setTimeout(() => resolve(parsedTodos), 300); // Simulate network delay
    });
  },

  addTodo: async (
    title: string,
    description?: string,
    dueDate?: Date,
    priority?: Priority,
    category?: Category
  ): Promise<Todo> => {
    return new Promise((resolve) => {
      const newTodo = createTodo(
        title,
        description,
        dueDate,
        priority,
        category
      );

      // Get current todos
      const storedTodos = localStorage.getItem("todos");
      const todos = storedTodos ? JSON.parse(storedTodos) : [];

      // Add new todo
      const updatedTodos = [...todos, newTodo];
      localStorage.setItem("todos", JSON.stringify(updatedTodos));

      setTimeout(() => resolve(newTodo), 300); // Simulate network delay
    });
  },

  updateTodo: async (updatedTodo: Todo): Promise<Todo> => {
    return new Promise((resolve, reject) => {
      // Get current todos
      const storedTodos = localStorage.getItem("todos");
      const todos = storedTodos ? JSON.parse(storedTodos) : [];

      // Find and update the todo
      const todoIndex = todos.findIndex(
        (todo: Todo) => todo.id === updatedTodo.id
      );

      if (todoIndex === -1) {
        reject(new Error("Todo not found"));
        return;
      }

      todos[todoIndex] = updatedTodo;
      localStorage.setItem("todos", JSON.stringify(todos));

      setTimeout(() => resolve(updatedTodo), 300); // Simulate network delay
    });
  },

  deleteTodo: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Get current todos
      const storedTodos = localStorage.getItem("todos");
      const todos = storedTodos ? JSON.parse(storedTodos) : [];

      // Filter out the todo to delete
      const updatedTodos = todos.filter((todo: Todo) => todo.id !== id);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));

      setTimeout(() => resolve(true), 300); // Simulate network delay
    });
  },
};
