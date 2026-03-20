import type { FC } from 'react';
import { Card } from '@/components';
import styles from './EmbedsPage.module.css';

interface BrowserPreviewProps {
  embedUrl: string | null;
}

export const BrowserPreview: FC<BrowserPreviewProps> = ({ embedUrl }) => (
  <Card style={{ marginBottom: 16 }}>
    <div className={styles.sectionTitle}>Preview</div>
    <div className={styles.browserFrame}>
      <div className={styles.browserBar}>
        <div className={styles.browserDots}>
          <span className={styles.dotRed} />
          <span className={styles.dotYellow} />
          <span className={styles.dotGreen} />
        </div>
        <div className={styles.browserUrl}>
          {embedUrl ?? 'visumed.edu/shared/...'}
        </div>
      </div>
      <div className={styles.browserContent} style={embedUrl ? { height: 240 } : undefined}>
        {embedUrl ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-ter)', textAlign: 'center', padding: '0 16px' }}>
              La preview no está disponible aquí porque el visor solo se muestra en dominios autorizados.
            </div>
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12,
                color: 'var(--color-accent)',
                textDecoration: 'none',
                padding: '6px 14px',
                border: '1px solid var(--color-accent)',
                borderRadius: 6,
              }}
            >
              Abrir visor en nueva pestaña
            </a>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div className={styles.previewCircle} />
            <div className={styles.previewLabel}>Crea un visor para ver la preview</div>
          </div>
        )}
      </div>
    </div>
  </Card>
);
