import React from "react";
import { DeleteConfirmationModalProps } from "../types";

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  showModal,
  setShowModal,
  handleDelete,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Confirm Deletion
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this media item? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
