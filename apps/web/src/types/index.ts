export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  landingPageType: string;
  templateUrl: string | null;
  keyword: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  limit: number;
  page: number;
  total: number;
}

export type PaginatedResponse<T> = {
  data: T[];
  meta?: Meta;
  success: boolean;
  message: string;
  statusCode: number;
};

export type ResponseObject<T> = {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
};
