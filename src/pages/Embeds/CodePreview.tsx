import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Embed } from '@/types';
import { Card, Button } from '@/components';
import { CopyIcon, CheckIcon, ExternalLinkIcon } from '@/components/Icon/icons';
import { tokens } from '@/theme';
import styles from './EmbedsPage.module.css';

interface CodePreviewProps {
  embed: Embed | null;
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

export const CodePreview: FC<CodePreviewProps> = ({ embed }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reinicia el feedback de copiado al cambiar de visor seleccionado
  useEffect(() => {
    setCopiedCode(false);
    setCopiedLink(false);
  }, [embed?.id]);

  const url = embed?.embed_url ?? null;
  const code = url ? buildEmbedCode(url) : null;

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Card>
      <div className={styles.codeHeader}>
        <div className={styles.sectionTitle} style={{ marginBottom: 0 }}>Código del visor</div>
        {code && (
          <Button small onClick={handleCopyCode}>
            {copiedCode ? (
              <><CheckIcon color={tokens.green} size={12} /> ¡Copiado!</>
            ) : (
              <><CopyIcon /> Copiar código</>
            )}
          </Button>
        )}
      </div>

      {embed && url ? (
        <>
          <div className={styles.codeContext}>
            Visor: <strong>{embed.content}</strong> · Dominio autorizado: <strong>{embed.domain}</strong>
          </div>

          <pre className={styles.codeBlock}>{code}</pre>

          <div className={styles.publicLinkSection}>
            <label className={styles.fieldLabel}>Enlace público</label>
            <div className={styles.publicLinkRow}>
              <input
                className={styles.publicLinkInput}
                type="text"
                readOnly
                value={url}
                onFocus={(e) => e.currentTarget.select()}
              />
              <Button small onClick={handleCopyLink}>
                {copiedLink ? (
                  <><CheckIcon color={tokens.green} size={12} /> ¡Copiado!</>
                ) : (
                  <><CopyIcon /> Copiar</>
                )}
              </Button>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.openLinkBtn}
                title="Abrir en una nueva pestaña"
              >
                <ExternalLinkIcon size={12} /> Abrir
              </a>
            </div>
            <p className={styles.publicLinkHint}>
              Este enlace abre la imagen directamente en el navegador. El código iframe solo
              funciona dentro del dominio autorizado.
            </p>
          </div>
        </>
      ) : (
        <div className={styles.codeEmpty}>
          Crea un visor o selecciona uno de la lista &ldquo;Visores Activos&rdquo; para ver su
          código embebido y su enlace público.
        </div>
      )}
    </Card>
  );
};
