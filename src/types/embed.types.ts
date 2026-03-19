export type EmbedStatus = 'active' | 'expired';
export type EmbedContentType = 'Imagen' | 'Colección';

export interface Embed {
  id: number;
  content: string;
  type: EmbedContentType;
  domain: string;
  views: number;
  status: EmbedStatus;
  expires: string | null;
  embed_url: string | null;
}

export interface EmbedConfig {
  publishType: 'image' | 'collection' | 'course';
  showToolbar: boolean;
  allowZoom: boolean;
  showCaseInfo: boolean;
  showMetadata: boolean;
  allowFullscreen: boolean;
  darkMode: boolean;
}
