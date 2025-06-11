import { useReducer, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MediaItem, User } from "../types";
import { getAllMedia } from "../api";

interface MediaState {
  mediaItems: MediaItem[];
  users: User[];
  currentUser: string;
  isLoading: boolean;
  isRefreshing: boolean;
}

type MediaAction =
  | { type: "SET_MEDIA_ITEMS"; payload: MediaItem[] }
  | {
      type: "UPDATE_MEDIA_ITEMS";
      payload: (prevState: MediaItem[]) => MediaItem[];
    }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "SET_CURRENT_USER"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_REFRESHING"; payload: boolean }
  | { type: "RESET_STATE" };

const mediaReducer = (state: MediaState, action: MediaAction): MediaState => {
  switch (action.type) {
    case "SET_MEDIA_ITEMS":
      return { ...state, mediaItems: action.payload };
    case "UPDATE_MEDIA_ITEMS":
      // Apply the updater function to current state - this prevents race conditions
      return { ...state, mediaItems: action.payload(state.mediaItems) };
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_REFRESHING":
      return { ...state, isRefreshing: action.payload };
    case "RESET_STATE":
      return {
        mediaItems: [],
        users: [],
        currentUser: "",
        isLoading: false,
        isRefreshing: false,
      };
    default:
      return state;
  }
};

const initialState: MediaState = {
  mediaItems: [],
  users: [],
  currentUser: "",
  isLoading: false,
  isRefreshing: false,
};

export const useMediaData = () => {
  const [state, dispatch] = useReducer(mediaReducer, initialState);

  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) dispatch({ type: "SET_LOADING", payload: true });

      const response = await getAllMedia();

      // Handle the API response structure
      let mediaArray: MediaItem[] = [];
      if (response && response.data && Array.isArray(response.data)) {
        mediaArray = response.data;
      } else if (Array.isArray(response)) {
        mediaArray = response;
      }

      dispatch({ type: "SET_MEDIA_ITEMS", payload: mediaArray });

      // Extract unique users from media data
      const uniqueUsers = mediaArray.reduce((acc: User[], item: MediaItem) => {
        const exists = acc.find((user) => user.id === item.created_by);
        if (!exists) {
          acc.push({
            id: item.created_by,
            email: item.created_by,
          });
        }
        return acc;
      }, []);

      dispatch({ type: "SET_USERS", payload: uniqueUsers });
    } catch (error) {
      console.error("Failed to load media:", error);
    } finally {
      if (showLoading) dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_REFRESHING", payload: false });
    }
  }, []);

  const setCurrentUser = useCallback((user: string) => {
    dispatch({ type: "SET_CURRENT_USER", payload: user });
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem("username");
      if (user) {
        dispatch({ type: "SET_CURRENT_USER", payload: user });
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, []);

  const setRefreshing = useCallback((refreshing: boolean) => {
    dispatch({ type: "SET_REFRESHING", payload: refreshing });
  }, []);

  const addMediaItem = useCallback(
    (newMedia: MediaItem) => {
      dispatch({
        type: "SET_MEDIA_ITEMS",
        payload: [newMedia, ...state.mediaItems],
      });
    },
    [state.mediaItems],
  );

  // Helper function for MediaList component compatibility
  const setMediaItems = useCallback(
    (updater: React.SetStateAction<MediaItem[]>) => {
      if (typeof updater === "function") {
        // Use dispatch with a special action that applies the updater function
        // This ensures we always get the latest state, avoiding race conditions
        dispatch({ type: "UPDATE_MEDIA_ITEMS", payload: updater });
      } else {
        dispatch({ type: "SET_MEDIA_ITEMS", payload: updater });
      }
    },
    [], // No dependencies! This prevents stale closures
  );

  return {
    state,
    fetchData,
    fetchCurrentUser,
    setCurrentUser,
    resetState,
    setRefreshing,
    addMediaItem,
    setMediaItems,
  };
};

export type { MediaState };
