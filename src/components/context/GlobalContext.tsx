import { createContext, useContext, useState } from "react";
import { Todo } from "../../types/todo";

interface GlobalContextType {
  editingTodo: Todo | null;
  setEditingTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
}

const GlobalContext = createContext<GlobalContextType>({
//   editingTodo: Todo | null;
//   //   handleEditTodo: (todo: Todo) => void;
//   setEditingTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  editingTodo: null,
  //   handleEditTodo: () => {},
  setEditingTodo: () => {},
});

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  //   const handleEditTodo = (todo: Todo) => {
  //     setEditingTodo(todo);
  //   };
  //   const handleCloseModal = () => {
  //     setEditingTodo(null);
  //   };
  return (
    <GlobalContext.Provider value={{ editingTodo, setEditingTodo }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
