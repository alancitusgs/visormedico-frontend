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

export interface VisitsPerDay {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface DeviceCount {
  device: string;
  count: number;
}

export interface VisitItem {
  id: number;
  timestamp: string;
  ip: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  target: string;
  target_type: 'image' | 'collection';
  referer: string | null;
}

export interface VisitStats {
  total: number;
  today: number;
  uniqueVisitors30d: number;
  perDay: VisitsPerDay[];
  devices: DeviceCount[];
  recent: VisitItem[];
}
