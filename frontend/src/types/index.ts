export interface AuthResponse {
  accessToken: string;
  fullName: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface ForkliftResponse {
  id: number;
  brand: string;
  number: string;
  loadCapacity: number;
  isActive: boolean;
  modifiedAt: string;
  modifiedBy: string;
}

export interface ForkliftRequest {
  brand: string;
  number: string;
  loadCapacity: number;
  isActive: boolean;
}

export interface IncidentResponse {
  id: number;
  forkliftId: number;
  startedAt: string;
  resolvedAt: string | null;
  description: string | null;
  downtimeFormatted: string;
}

export interface IncidentRequest {
  startedAt: string;
  resolvedAt: string | null;
  description: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
