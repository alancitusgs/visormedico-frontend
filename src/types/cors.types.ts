export type CorsStatus = 'active' | 'expired' | 'dev';

export interface CorsDomain {
  domain: string;
  desc: string;
  embeds: number;
  status: CorsStatus;
}
