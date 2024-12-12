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
import { MediaItem } from "./types";

const App: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token"),
  );
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchMedia = async () => {
        try {
          const mediaData = await getAllMedia();
          setMediaItems(mediaData);
        } catch (error) {
          console.error("Error fetching media:", error);
        }
      };

      fetchMedia();
    }
  }, [isAuthenticated]);

  const addNewMediaItem = (newMedia: MediaItem) => {
    flushSync(() => {
      setMediaItems((prevItems) => [...prevItems, newMedia]);
    });

    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
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
