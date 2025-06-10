import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/Button";
import { DeleteConfirmationModalProps } from "../types";

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  showModal,
  setShowModal,
  handleDelete,
}) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700 transition-colors duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
              {t("media.deleteConfirm.title")}
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center leading-relaxed">
              {t("media.deleteConfirm.message")}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                onClick={() => setShowModal(false)}
                variant="outline"
                className="w-full sm:w-auto order-2 sm:order-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {t("general.cancel")}
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                className="w-full sm:w-auto order-1 sm:order-2 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white transition-colors duration-200"
              >
                {t("media.deleteConfirm.confirm")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
