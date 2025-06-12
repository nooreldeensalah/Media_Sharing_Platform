// Core shared types
export interface MediaItem {
  id: number;
  file_name: string;
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

export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  token: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export type PasswordStrength = {
  hasLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

// Backend-specific types
export interface User {
  id: number;
  username: string;
  password: string;
}

export interface DatabaseMediaItem {
  id: number;
  file_name: string;
  original_filename?: string;
  likes: number;
  created_at: string;
  mimetype: string;
  created_by: string;
}

export interface MediaItemWithUserInfo extends DatabaseMediaItem {
  username: string;
  likedByUser: boolean;
  deletable: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface LikeAction {
  action: 'like' | 'unlike';
}

export interface UploadNotification {
  fileName: string;
  mimeType: string;
  originalFilename?: string;
}

export interface AuthenticatedUser {
  id: number;
  username: string;
}

export interface ServiceError extends Error {
  statusCode?: number;
}

// Service response types
export interface ToggleLikeResponse {
  message: string;
  action: string;
  newLikeCount: number;
}

export interface DeleteMediaResponse {
  message: string;
}

export interface UploadUrlResponse {
  url: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
}
