import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { flushSync } from "react-dom";
import MediaList from "./components/MediaList";
import UploadMedia from "./components/UploadMedia";
import Login from "./components/Login";
import Register from "./components/Register";
import NavBar from "./components/NavBar";
import { getAllMedia } from "./api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MediaItem, PaginationMetadata } from "./types";

const App: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token"),
  );
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const fetchMedia = React.useCallback(
    async (page: number = 1) => {
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          const response = await getAllMedia(page, 10);
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
    [isAuthenticated]
  );

  useEffect(() => {
    fetchMedia(1);
  }, [isAuthenticated, fetchMedia]);

  const addNewMediaItem = (newMedia: MediaItem) => {
    flushSync(() => {
      setMediaItems((prevItems) => {
        // Handle empty bucket scenario (no pagination) or page 1
        if (!pagination || pagination.currentPage === 1) {
          // Add at the beginning and maintain page size (default to 10 if no pagination)
          const newItems = [newMedia, ...prevItems];
          const itemsPerPage = pagination?.itemsPerPage || 10;
          return newItems.slice(0, itemsPerPage);
        } else {
          // On other pages, don't add the item to the current view
          // User should go to page 1 to see the new item
          return prevItems;
        }
      });

      // Update pagination to reflect the new item
      setPagination((prevPagination) => {
        if (prevPagination) {
          const newTotalItems = prevPagination.totalItems + 1;
          return {
            ...prevPagination,
            totalItems: newTotalItems,
            totalPages: Math.ceil(newTotalItems / prevPagination.itemsPerPage)
          };
        } else {
          // Create initial pagination for the first item
          return {
            currentPage: 1,
            totalPages: 1,
            totalItems: 1,
            itemsPerPage: 10,
            hasNextPage: false,
            hasPreviousPage: false
          };
        }
      });
    });

    // Scroll to top to show the new item
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handlePageChange = (page: number) => {
    fetchMedia(page);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setMediaItems([]);
    setPagination(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center p-4">
        <NavBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        <main className="w-full max-w-5xl space-y-6">
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
                  <>
                    <section>
                      <UploadMedia addNewMediaItem={addNewMediaItem} />
                    </section>
                    <section>
                      <h2 className="text-xl font-semibold mb-4">
                        Media Gallery
                      </h2>
                      <MediaList
                        mediaItems={mediaItems}
                        setMediaItems={setMediaItems}
                        lastItemRef={lastItemRef}
                        pagination={pagination}
                        setPagination={setPagination}
                        onPageChange={handlePageChange}
                        isLoading={isLoading}
                      />
                    </section>
                  </>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;
