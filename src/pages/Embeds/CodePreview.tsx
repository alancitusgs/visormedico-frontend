import { useState } from 'react';
import type { FC } from 'react';
import { Card, Button } from '@/components';
import { CopyIcon, CheckIcon } from '@/components/Icon/icons';
import { tokens } from '@/theme';
import styles from './EmbedsPage.module.css';

interface CodePreviewProps {
  embedUrl: string | null;
}

function buildEmbedCode(url: string): string {
  return `<iframe
  src="${url}"
  width="800" height="600"
  frameborder="0"
  allow="fullscreen"
  style="border:none; border-radius:8px;"
  title="VisuMed Viewer">
</iframe>`;
}

export const CodePreview: FC<CodePreviewProps> = ({ embedUrl }) => {
  const [copied, setCopied] = useState(false);

  const code = embedUrl ? buildEmbedCode(embedUrl) : null;

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div className={styles.sectionTitle} style={{ marginBottom: 0 }}>Código del visor</div>
        {code && (
          <Button small onClick={handleCopy}>
            {copied ? (
              <><CheckIcon color={tokens.green} size={12} /> ¡Copiado!</>
            ) : (
              <><CopyIcon /> Copiar</>
            )}
          </Button>
        )}
      </div>
      {code ? (
        <pre className={styles.codeBlock}>{code}</pre>
      ) : (
        <div style={{ color: 'var(--color-text-ter)', fontSize: 12, padding: '16px 0' }}>
          Crea un visor para obtener el código embebido
        </div>
      )}
    </Card>
  );
};
