export interface MediaItem {
  id: number;
  file_name: string;
  original_filename?: string;
  likes: number;
  url: string;
  created_at: string;
  mimetype: string;
  likedByUser: boolean;
  created_by: string;
  deletable: boolean;
}

export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedMediaResponse {
  data: MediaItem[];
  pagination: PaginationMetadata;
}

export interface NavBarProps {
  isAuthenticated: boolean;
  handleLogout: () => void;
}

export interface UploadMediaProps {
  addNewMediaItem: (newMedia: MediaItem) => void;
}

export interface MediaListProps {
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  lastItemRef: React.RefObject<HTMLDivElement>;
  pagination?: PaginationMetadata | null;
  setPagination?: React.Dispatch<React.SetStateAction<PaginationMetadata | null>>;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  onUserFilter?: (username: string) => void;
}

export interface FileInputProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export interface DeleteConfirmationModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  handleDelete: () => void;
}

export interface MediaItemCardProps {
  item: MediaItem;
  handleLike: (id: number) => void;
  handleUnlike: (id: number) => void;
  confirmDelete: (id: number) => void;
  onUserFilter?: (username: string) => void;
}

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

export interface UploadButtonProps {
  handleUpload: () => void;
  uploading: boolean;
}
