export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface DashboardStats {
  totalImages: number;
  totalCourses: number;
  totalCollections: number;
  totalEmbeds: number;
  totalCorsDomains: number;
}

export interface ActivityItem {
  type: 'image' | 'embed' | 'cors' | 'collection' | 'course';
  text: string;
  timestamp: string;
}
