import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import type { Embed } from '@/types';
import { Card } from '@/components';
import { StatusDot } from '@/components';
import { TrashIcon } from '@/components/Icon/icons';
import { embedsService } from '@/services/embeds.service';
import { EmbedCreator } from './EmbedCreator';
import { CodePreview } from './CodePreview';
import { BrowserPreview } from './BrowserPreview';
import styles from './EmbedsPage.module.css';

export const EmbedsPage: FC = () => {
  const [embeds, setEmbeds] = useState<Embed[]>([]);
  const [lastCreatedUrl, setLastCreatedUrl] = useState<string | null>(null);

  const loadEmbeds = useCallback(() => {
    embedsService.getEmbeds().then(setEmbeds).catch(() => {});
  }, []);

  useEffect(() => {
    loadEmbeds();
  }, [loadEmbeds]);

  const handleCreated = (embedUrl: string) => {
    setLastCreatedUrl(embedUrl);
    loadEmbeds();
  };

  const handleDelete = async (id: number) => {
    try {
      await embedsService.deleteEmbed(id);
      loadEmbeds();
    } catch {
      // ignore
    }
  };

  return (
    <div className={styles.page}>
      <div>
        <EmbedCreator onCreated={handleCreated} />
        <CodePreview embedUrl={lastCreatedUrl} />
      </div>
      <div>
        <BrowserPreview embedUrl={lastCreatedUrl} />
        <Card>
          <div className={styles.sectionTitle}>Visores Activos</div>
          {embeds.length === 0 && (
            <p style={{ color: 'var(--color-text-ter)', fontSize: 12, padding: '8px 0' }}>
              No hay visores publicados.
            </p>
          )}
          {embeds.map((e, i) => (
            <div
              key={e.id}
              className={styles.embedItem}
              style={{
                borderBottom: i < embeds.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                opacity: e.status === 'expired' ? 0.5 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>
                  <span
                    className={`${styles.embedTypeBadge} ${e.type === 'Colección' ? styles.embedTypeBadgeCollection : styles.embedTypeBadgeImage}`}
                  >
                    {e.type}
                  </span>
                  {e.content}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StatusDot status={e.status} />
                  <button
                    onClick={() => handleDelete(e.id)}
                    title="Eliminar visor"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 2,
                      opacity: 0.5,
                    }}
                  >
                    <TrashIcon size={12} color="var(--color-text-ter)" />
                  </button>
                </div>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-ter)' }}>
                {e.domain} · {e.views} vistas
                {e.embed_url && (
                  <>
                    {' · '}
                    <a
                      href={e.embed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                    >
                      Abrir
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};
