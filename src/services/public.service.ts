import axios from 'axios';
import type { SlideProperties } from '@/types';

/** Axios instance without auth interceptors — for public/shared endpoints. */
const publicHttp = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface SharedImageData {
  id: number;
  filename: string;
  original_name: string;
  patient_name: string | null;
  patient_id: string | null;
  study_date: string | null;
  modality: string | null;
  type: 'dicom' | 'svs';
  url: string | null;
  wadouri: string | null;
  dzi_path: string | null;
}

interface SharedImageResponse {
  success: boolean;
  allowed_domains: string[];
  data: SharedImageData;
}

interface SharedCollectionResponse {
  success: boolean;
  allowed_domains: string[];
  collection_name: string;
  images: SharedImageData[];
}

export const publicService = {
  async getSharedImage(token: string): Promise<{ image: SharedImageData; allowedDomains: string[] }> {
    const { data } = await publicHttp.get<SharedImageResponse>(
      '/viewer/image-shared',
      { params: { token } },
    );
    return { image: data.data, allowedDomains: data.allowed_domains };
  },

  async getSharedCollection(token: string): Promise<{
    collectionName: string;
    images: SharedImageData[];
    allowedDomains: string[];
  }> {
    const { data } = await publicHttp.get<SharedCollectionResponse>(
      '/viewer/collection-shared',
      { params: { token } },
    );
    return {
      collectionName: data.collection_name,
      images: data.images,
      allowedDomains: data.allowed_domains,
    };
  },

  async getSlideProperties(stem: string): Promise<SlideProperties> {
    const { data } = await publicHttp.get<SlideProperties>(`/tiles/${stem}/properties`);
    return data;
  },
};
