import { MdClose } from "react-icons/md";
import Button from "./Button";
import { ClipLoader } from "react-spinners";

const DeletePopup = ({ onClose, onDelete, loading }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-md w-96 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <MdClose size={20} />
        </button>

        <div className="text-center mt-4">
          <h4 className="mt-3 mb-2 text-lg font-semibold">Are you sure?</h4>
          <p className="text-gray-500 text-sm">
            Do you really want to delete this record? <br />
            This action cannot be undone.
          </p>

          <div className="flex justify-center mt-4 gap-2">
            <Button onClick={onClose} className="px-4!" variant="secondary">
              Cancel
            </Button>

            <Button
              className="px-4! bg-red-600 hover:bg-red-700 text-white"
              variant="custom"
              disabled={loading}
              onClick={onDelete}
            >
              {loading ? <ClipLoader size={20} color="#FFFFFF" /> : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
