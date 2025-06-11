import { useMemo, useState, useEffect } from "react";
import { MediaItem } from "../types";
import { useDebounce } from "./useDebounce";

interface UseMediaFilteringProps {
  mediaItems: MediaItem[];
  itemsPerPage: number;
}

export const useMediaFiltering = ({
  mediaItems,
  itemsPerPage,
}: UseMediaFilteringProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter and search logic using useMemo for better performance
  const filteredItems = useMemo(() => {
    let filtered = [...mediaItems];

    // Filter by user
    if (selectedUser) {
      filtered = filtered.filter((item) => item.created_by === selectedUser);
    }

    // Filter by search query
    if (debouncedSearchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.file_name
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          item.created_by
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [mediaItems, selectedUser, debouncedSearchQuery]);

  // Reset to page 1 when search or filter changes (but not when items are just deleted)
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedUser, debouncedSearchQuery]);

  // Update pagination when filtered items change
  useEffect(() => {
    const newTotalPages = Math.ceil(filteredItems.length / itemsPerPage);
    setTotalPages(newTotalPages);

    // Smart pagination: only change page if current page becomes invalid
    if (currentPage > newTotalPages && newTotalPages > 0) {
      // If current page is beyond the new total pages, go to the last valid page
      setCurrentPage(newTotalPages);
    } else if (filteredItems.length === 0) {
      // If no items, reset to page 1
      setCurrentPage(1);
    }
    // Otherwise, keep the current page (preserve user's position)
  }, [filteredItems.length, itemsPerPage, currentPage]);

  // Get paginated items using useMemo for performance
  const paginatedItems = useMemo(() => {
    return filteredItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredItems, currentPage, itemsPerPage]);

  return {
    searchQuery,
    setSearchQuery,
    selectedUser,
    setSelectedUser,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredItems,
    paginatedItems,
    debouncedSearchQuery,
  };
};
