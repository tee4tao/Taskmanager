import { Todo } from "../types/todo";

interface DeleteModalProps {
  todo: Todo;
  onClose: () => void;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: (id: string) => void;
}

const DeletModal = ({
  todo,
  onClose,
  setDeleteModal,
  onDelete,
}: DeleteModalProps) => {
  return (
    <section className="fixed top-0 left-0 bg-[#0000008e] h-full w-full z-30 flex items-center justify-center">
      <div className="bg-white w-80 h-44 rounded-md p-2 flex flex-col items-center">
        <p className="font-medium">
          "{todo.title}" will be permanently deleted.
        </p>
        <p className="mb-4 mt-2">You won't be able to undo this action.</p>
        <div className="flex self-end gap-2 p-4 font-medium">
          <button
            className="py-1 px-3 border rounded-md text-sm bg-[#f3f2f1] text-[#323130] hover:border-[#323130] transition-all duration-200"
            onClick={() => setDeleteModal(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-1 px-3 border-none rounded-md text-sm bg-red-700 text-white"
            onClick={() => {
              onDelete(todo.id);
              setDeleteModal(false);
              onClose();
            }}
          >
            Delete task
          </button>
        </div>
      </div>
    </section>
  );
};

export default DeletModal;
