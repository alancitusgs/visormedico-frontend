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
          <iframe
            src={embedUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Preview del visor"
          />
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
