import { http } from './http';
import type { Embed, Study, Collection } from '@/types';

interface EmbedCreateResponse {
  id: number;
  share_token: string;
  embed_url: string;
}

export const embedsService = {
  async getEmbeds(): Promise<Embed[]> {
    const { data } = await http.get<Embed[]>('/admin/embeds');
    return data;
  },

  async createEmbed(imageId: number, domain: string): Promise<EmbedCreateResponse> {
    const { data } = await http.post<EmbedCreateResponse>('/admin/embeds', {
      image_id: imageId,
      domain,
    });
    return data;
  },

  async createCollectionEmbed(collectionId: number, domain: string): Promise<EmbedCreateResponse> {
    const { data } = await http.post<EmbedCreateResponse>('/admin/embeds', {
      collection_id: collectionId,
      domain,
    });
    return data;
  },

  async deleteEmbed(embedId: number): Promise<void> {
    await http.delete(`/admin/embeds/${embedId}`);
  },

  async getImages(): Promise<Study[]> {
    const { data } = await http.get<Study[]>('/admin/images');
    return data;
  },

  async getCollections(): Promise<Collection[]> {
    const { data } = await http.get<Collection[]>('/admin/collections');
    return data;
  },
};
