import type { FC } from 'react';
import type { StudyWithUrls } from '@/types';
import { tokens } from '@/theme';
import styles from './ViewerPage.module.css';

interface MetadataPanelProps {
  image: StudyWithUrls | null;
}

export const MetadataPanel: FC<MetadataPanelProps> = ({ image }) => {
  const metadata: [string, string][] = image
    ? [
        ['Archivo', image.original_name],
        ['Modalidad', image.modality || '—'],
        ['Paciente', image.patient_name || '—'],
        ['ID Paciente', image.patient_id || '—'],
        ['Fecha', image.study_date || '—'],
        ['Nombre archivo', image.filename],
      ]
    : [];

  return (
    <div className={styles.metaPanel}>
      <div className={styles.metaTabs}>
        <button className={`${styles.metaTab} ${styles.metaTabActive}`}>
          Metadata
        </button>
      </div>
      <div className={styles.metaBody}>
        {metadata.length === 0 && (
          <div style={{ fontSize: 12, color: tokens.textTer, padding: '8px 0' }}>
            Selecciona una imagen
          </div>
        )}
        {metadata.map(([k, v]) => (
          <div key={k} className={styles.metaRow}>
            <span style={{ color: tokens.textTer }}>{k}</span>
            <span style={{ color: tokens.text, fontWeight: 500, fontFamily: 'monospace', fontSize: 10 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
