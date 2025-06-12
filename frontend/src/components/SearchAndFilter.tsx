import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  UserIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Button } from "./ui/Button";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onUserFilter: (username: string | null) => void;
  currentSearch: string;
  activeSearch: string;
  currentUserFilter: string | null;
  onClearFilters: () => void;
  availableUsers?: string[];
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onUserFilter,
  currentSearch,
  activeSearch,
  currentUserFilter,
  onClearFilters,
  availableUsers = [],
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(currentSearch);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique users excluding current user filter
  const filteredUsers = useMemo(() => {
    return availableUsers.filter(user => user !== currentUserFilter);
  }, [availableUsers, currentUserFilter]);

  // Sync local state when external search changes (e.g., from clear filters)
  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Immediate search on Enter key press
    onSearch(searchValue.trim());
  };

  const handleSearchClear = () => {
    setSearchValue("");
    onSearch("");
  };

  const handleUserSelect = (username: string) => {
    onUserFilter(username);
    setShowUserDropdown(false);
  };

  const hasActiveFilters = activeSearch || currentUserFilter;

  // Show typing indicator when user is typing but search hasn't been triggered yet
  const isTyping = searchValue !== currentSearch;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 mb-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col space-y-4">
        {/* Search and Filter Row */}
        <div className="flex gap-3">
          {/* Search Bar */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("media.search.label")}
            </label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    onSearch(e.target.value);
                  }}
                  placeholder={t("media.search.placeholder")}
                  className="w-full pl-10 pr-20 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {/* Search indicator */}
                  <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                    {isTyping ? (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                        <span className="text-xs">…</span>
                      </div>
                    ) : (
                      <span>↵</span>
                    )}
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
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t("media.search.autoHint")}
            </p>
          </div>

          {/* User Filter Dropdown */}
          <div className="min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("media.filters.userLabel")}
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[140px]"
              >
              <UserIcon className="h-5 w-5" />
              <span className="flex-1 text-left">
                {currentUserFilter || t("media.filters.allUsers")}
              </span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown */}
            <AnimatePresence>
              {showUserDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  {/* All Users option */}
                  <button
                    onClick={() => {
                      onUserFilter(null);
                      setShowUserDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                      !currentUserFilter ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      <span>{t("media.filters.allUsers")}</span>
                    </div>
                  </button>

                  {/* Individual users */}
                  {filteredUsers.map((username) => (
                    <button
                      key={username}
                      onClick={() => handleUserSelect(username)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-900 dark:text-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        <span>{username}</span>
                      </div>
                    </button>
                  ))}

                  {filteredUsers.length === 0 && !currentUserFilter && (
                    <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">
                      {t("media.filters.noUsers")}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </div>

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
            {activeSearch && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full text-sm"
              >
                <MagnifyingGlassIcon className="h-3 w-3" />
                <span>"{activeSearch}"</span>
                <button
                  onClick={handleSearchClear}
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
