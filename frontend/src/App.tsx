import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { flushSync } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import MediaList from "./components/MediaList";
import UploadMedia from "./components/UploadMedia";
import SearchAndFilter from "./components/SearchAndFilter";
import Login from "./components/Login";
import Register from "./components/Register";
import NavBar from "./components/NavBar";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { getAllMedia } from "./api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MediaItem, PaginationMetadata } from "./types";
import { useDebounce } from "./hooks/useDebounce";
import "./i18n";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token"),
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchMedia = React.useCallback(
    async (page: number = 1, search?: string, user?: string | null) => {
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          const response = await getAllMedia(
            page,
            8,
            user || undefined,
            search || undefined,
          );
          if (response.data) {
            setMediaItems(response.data);
            setPagination(response.pagination);
          } else {
            setMediaItems(response);
            setPagination(null);
          }
        } catch (error) {
          console.error("Error fetching media:", error);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [isAuthenticated],
  );

  // Fetch media when authentication state, search, or user filter changes
  useEffect(() => {
    fetchMedia(1, debouncedSearchQuery, userFilter);
  }, [isAuthenticated, debouncedSearchQuery, userFilter, fetchMedia]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleUserFilter = (username: string | null) => {
    setUserFilter(username);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setUserFilter(null);
  };

  const addNewMediaItem = (newMedia: MediaItem) => {
    flushSync(() => {
      setMediaItems((prevItems) => {
        if (!pagination || pagination.currentPage === 1) {
          const newItems = [newMedia, ...prevItems];
          const itemsPerPage = pagination?.itemsPerPage || 10;
          return newItems.slice(0, itemsPerPage);
        } else {
          return prevItems;
        }
      });

      setPagination((prevPagination) => {
        if (prevPagination) {
          const newTotalItems = prevPagination.totalItems + 1;
          return {
            ...prevPagination,
            totalItems: newTotalItems,
            totalPages: Math.ceil(newTotalItems / prevPagination.itemsPerPage),
          };
        } else {
          return {
            currentPage: 1,
            totalPages: 1,
            totalItems: 1,
            itemsPerPage: 10,
            hasNextPage: false,
            hasPreviousPage: false,
          };
        }
      });
    });

    // Scroll to gallery section to show the new item
    setTimeout(() => {
      const gallerySection = document.getElementById("gallery-section");
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handlePageChange = (page: number) => {
    fetchMedia(page, debouncedSearchQuery, userFilter);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setMediaItems([]);
    setPagination(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      <div className="min-h-screen flex flex-col items-center px-4 py-2">
        <NavBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        <main id="main-content" className="w-full max-w-[1600px] space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" />
                  ) : (
                    <Login setIsAuthenticated={setIsAuthenticated} />
                  )
                }
              />
              <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/" /> : <Register />}
              />
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Compact upload section */}
                        <section id="upload-section">
                          <UploadMedia addNewMediaItem={addNewMediaItem} />
                        </section>

                        {/* Search and filter section */}
                        <SearchAndFilter
                          onSearch={handleSearch}
                          onUserFilter={handleUserFilter}
                          currentSearch={searchQuery}
                          currentUserFilter={userFilter}
                          onClearFilters={handleClearFilters}
                        />

                        {/* Gallery section with more space */}
                        <section id="gallery-section" className="flex-1">
                          <MediaList
                            mediaItems={mediaItems}
                            setMediaItems={setMediaItems}
                            lastItemRef={lastItemRef}
                            pagination={pagination}
                            setPagination={setPagination}
                            onPageChange={handlePageChange}
                            isLoading={isLoading}
                            onUserFilter={handleUserFilter}
                          />
                        </section>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
          </motion.div>
        </main>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme === "dark" ? "dark" : "light"}
          toastClassName="backdrop-blur-sm"
          bodyClassName="text-sm font-medium"
        />
      </div>
    </div>
  );
};

export default App;
