import React, { useEffect, useRef, useCallback } from "react";
import { StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MediaList from "../components/MediaList";
import { Loading } from "../components/ui/Loading";
import { HomeHeader } from "../components/HomeHeader";
import { HomeFooter } from "../components/HomeFooter";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/Colors";
import { useTranslation } from "react-i18next";
import { useToast } from "../contexts/ToastContext";
import { useMediaData } from "../hooks/useMediaData";
import { useMediaFiltering } from "../hooks/useMediaFiltering";
import { useMediaUpload } from "../hooks/useMediaUpload";
import { HomeScreenProps } from "../types";

const ITEMS_PER_PAGE = 5;

const HomeScreen: React.FC<HomeScreenProps> = ({ setIsAuthenticated }) => {
  // Custom hooks
  const {
    state,
    fetchData,
    fetchCurrentUser,
    resetState,
    addMediaItem,
    setMediaItems,
  } = useMediaData();

  const {
    searchQuery,
    setSearchQuery,
    selectedUser,
    setSelectedUser,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredItems,
    paginatedItems,
  } = useMediaFiltering({
    mediaItems: state.mediaItems,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const { isUploading, uploadFileName, uploadIsVideo, handleUpload } =
    useMediaUpload({
      onMediaUploaded: (media) => {
        addMediaItem(media);
        // Scroll to top to show new item
        setTimeout(() => {
          listRef.current?.scrollToOffset?.({ offset: 0, animated: true });
        }, 100);
      },
    });

  // Refs
  const listRef = useRef<any>(null);

  // Hooks
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);
  const { t } = useTranslation();
  const toast = useToast();

  useEffect(() => {
    fetchData();
    fetchCurrentUser();
  }, [fetchData, fetchCurrentUser]);

  const handleRefresh = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  const handleLogout = useCallback(async () => {
    try {
      // Clear state first to prevent further API calls
      resetState();

      // Clear authentication data
      await AsyncStorage.multiRemove(["token", "username"]);
      setIsAuthenticated(false);
      toast.success(t("success"), t("loggedOutSuccessfully"));
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(t("error"), t("logoutFailed"));
    }
  }, [resetState, setIsAuthenticated, toast, t]);

  if (state.isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Loading text={t("loading")} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <HomeHeader
        onLogout={handleLogout}
        isUploading={isUploading}
        uploadFileName={uploadFileName}
        uploadIsVideo={uploadIsVideo}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedUser={selectedUser}
        onUserChange={setSelectedUser}
        users={state.users}
        onRefresh={handleRefresh}
        isRefreshing={state.isRefreshing}
        onUpload={handleUpload}
      />

      <MediaList
        mediaItems={paginatedItems}
        setMediaItems={setMediaItems}
        currentUser={state.currentUser}
        listRef={listRef}
      />

      <HomeFooter
        filteredItemsLength={filteredItems.length}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
