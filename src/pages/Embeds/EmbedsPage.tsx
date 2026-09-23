import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import type { Embed } from '@/types';
import { Card } from '@/components';
import { StatusDot } from '@/components';
import { TrashIcon, LinkIcon, ExternalLinkIcon, CheckIcon, CodeIcon } from '@/components/Icon/icons';
import { tokens } from '@/theme';
import { embedsService } from '@/services/embeds.service';
import { EmbedCreator } from './EmbedCreator';
import { CodePreview } from './CodePreview';
import styles from './EmbedsPage.module.css';

export const EmbedsPage: FC = () => {
  const [embeds, setEmbeds] = useState<Embed[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<number | null>(null);

  const loadEmbeds = useCallback(async () => {
    try {
      const list = await embedsService.getEmbeds();
      setEmbeds(list);
      return list;
    } catch {
      return [] as Embed[];
    }
  }, []);

  useEffect(() => {
    loadEmbeds();
  }, [loadEmbeds]);

  const handleCreated = async (embedId: number) => {
    await loadEmbeds();
    setSelectedId(embedId);
  };

  const handleDelete = async (embed: Embed) => {
    const ok = window.confirm(
      `¿Eliminar el visor "${embed.content}"?\n\nEl código embebido y el enlace público dejarán de funcionar.`
    );
    if (!ok) return;
    try {
      await embedsService.deleteEmbed(embed.id);
      if (selectedId === embed.id) setSelectedId(null);
      loadEmbeds();
    } catch {
      // ignore
    }
  };

  const handleCopyLink = (embed: Embed) => {
    if (!embed.embed_url) return;
    navigator.clipboard.writeText(embed.embed_url);
    setCopiedLinkId(embed.id);
    setTimeout(() => setCopiedLinkId((prev) => (prev === embed.id ? null : prev)), 2000);
  };

  const selected = embeds.find((e) => e.id === selectedId) ?? null;

  return (
    <div className={styles.page}>
      <div>
        <EmbedCreator onCreated={handleCreated} />
        <CodePreview embed={selected} />
      </div>
      <div>
        <Card>
          <div className={styles.sectionTitle}>Visores Activos</div>
          {embeds.length === 0 && (
            <p className={styles.emptyList}>No hay visores publicados.</p>
          )}
          {embeds.map((e) => {
            const isSelected = e.id === selectedId;
            return (
              <div
                key={e.id}
                className={`${styles.embedItem} ${isSelected ? styles.embedItemSelected : ''} ${e.status === 'expired' ? styles.embedItemExpired : ''}`}
                onClick={() => setSelectedId(e.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    setSelectedId(e.id);
                  }
                }}
                title="Ver código embebido y enlace público"
              >
                <div className={styles.embedItemHeader}>
                  <span className={styles.embedItemName}>
                    <span
                      className={`${styles.embedTypeBadge} ${e.type === 'Colección' ? styles.embedTypeBadgeCollection : styles.embedTypeBadgeImage}`}
                    >
                      {e.type}
                    </span>
                    {e.content}
                  </span>
                  <StatusDot status={e.status} />
                </div>

                <div className={styles.embedItemMeta}>
                  {e.domain} · {e.views} vistas
                </div>

                <div className={styles.embedItemActions}>
                  <button
                    className={`${styles.embedActionBtn} ${isSelected ? styles.embedActionBtnActive : ''}`}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setSelectedId(e.id);
                    }}
                    title="Ver el código iframe de este visor"
                  >
                    <CodeIcon size={11} /> Código
                  </button>
                  {e.embed_url && (
                    <>
                      <button
                        className={styles.embedActionBtn}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleCopyLink(e);
                        }}
                        title="Copiar el enlace público de este visor"
                      >
                        {copiedLinkId === e.id ? (
                          <><CheckIcon size={11} color={tokens.green} /> ¡Copiado!</>
                        ) : (
                          <><LinkIcon size={11} /> Enlace público</>
                        )}
                      </button>
                      <a
                        className={styles.embedActionBtn}
                        href={e.embed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(ev) => ev.stopPropagation()}
                        title="Abrir el visor en una nueva pestaña"
                      >
                        <ExternalLinkIcon size={11} /> Abrir
                      </a>
                    </>
                  )}
                  <button
                    className={`${styles.embedActionBtn} ${styles.embedActionBtnDanger}`}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      handleDelete(e);
                    }}
                    title="Eliminar visor"
                  >
                    <TrashIcon size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
};
