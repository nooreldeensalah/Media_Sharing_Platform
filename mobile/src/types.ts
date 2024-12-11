import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList } from "react-native";

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

export type NavigationProp = StackNavigationProp<RootStackParamList>;

export interface MediaItem {
  id: number;
  file_name: string;
  likes: number;
  url: string;
  created_at: string;
  mimetype: string;
  likedByUser: boolean;
  created_by: string;
}

export interface MediaListProps {
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  currentUser: string;
  listRef: React.RefObject<FlatList<MediaItem>>;
}

export interface UploadIconProps {
  addNewMediaItem: (newMedia: MediaItem) => void;
}

// UploadMedia props
export interface UploadMediaProps {
  addNewMediaItem: (newMedia: MediaItem) => void;
}

// Password strength types
export type PasswordStrength = {
  hasLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

export interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
}

export interface LogoutButtonProps {
  onPress: () => void;
}

export interface HomeScreenProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export interface LoginScreenProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}
