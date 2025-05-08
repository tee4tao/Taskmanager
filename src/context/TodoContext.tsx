import React, { createContext, useContext, useState } from "react";
import { Todo } from "../types/todo";

interface TodoContextType {
  editingTodo: Todo | null;
  setEditingTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  deleteModal: boolean;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleCloseModal: () => void;
}

const TodoContext = createContext<TodoContextType>({
  //   editingTodo: Todo | null;
  //   //   handleEditTodo: (todo: Todo) => void;
  //   setEditingTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  editingTodo: null,
  //   handleEditTodo: () => {},
  setEditingTodo: () => {},
  deleteModal: false,
  setDeleteModal: () => {},
  handleCloseModal: () => {},
});

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  // State for delete modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const handleCloseModal = () => {
    setEditingTodo(null);
  };

  //   const handleEditTodo = (todo: Todo) => {
  //     setEditingTodo(todo);
  //   };
  //   const handleCloseModal = () => {
  //     setEditingTodo(null);
  //   };
  return (
    <TodoContext.Provider
      value={{
        editingTodo,
        setEditingTodo,
        deleteModal,
        setDeleteModal,
        handleCloseModal,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};
