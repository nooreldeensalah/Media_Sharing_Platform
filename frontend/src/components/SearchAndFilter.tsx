import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Button } from "./ui/Button";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onUserFilter: (username: string | null) => void;
  currentSearch: string;
  currentUserFilter: string | null;
  onClearFilters: () => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onUserFilter,
  currentSearch,
  currentUserFilter,
  onClearFilters,
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(currentSearch);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue.trim());
  };

  const handleSearchClear = () => {
    setSearchValue("");
    onSearch("");
  };

  const hasActiveFilters = currentSearch || currentUserFilter;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 mb-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t("media.search.placeholder")}
              className="w-full pl-10 pr-20 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {/* Search indicator */}
              <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                <span>↵</span>
              </div>
              {searchValue && (
                <button
                  type="button"
                  onClick={handleSearchClear}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  aria-label={t("general.clear")}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="sr-only"
            aria-label={t("media.search.submit")}
          >
            {t("media.search.submit")}
          </Button>
        </form>

        {/* Active Filters */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("media.filters.active")}:
            </span>

            {/* Search Filter Tag */}
            {currentSearch && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full text-sm"
              >
                <MagnifyingGlassIcon className="h-3 w-3" />
                <span>"{currentSearch}"</span>
                <button
                  onClick={() => onSearch("")}
                  className="ml-1 p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800/50 rounded-full transition-colors"
                  aria-label={t("media.filters.removeSearch")}
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </motion.div>
            )}

            {/* User Filter Tag */}
            {currentUserFilter && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                <UserIcon className="h-3 w-3" />
                <span>{currentUserFilter}</span>
                <button
                  onClick={() => onUserFilter(null)}
                  className="ml-1 p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full transition-colors"
                  aria-label={t("media.filters.removeUser")}
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </motion.div>
            )}

            {/* Clear All Button */}
            <Button
              onClick={onClearFilters}
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              {t("media.filters.clearAll")}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
