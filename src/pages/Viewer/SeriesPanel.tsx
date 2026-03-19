import type { FC } from 'react';
import type { StudyWithUrls } from '@/types';
import { ModalityBadge } from '@/components';
import { tokens } from '@/theme';
import styles from './ViewerPage.module.css';

interface SeriesPanelProps {
  images: StudyWithUrls[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export const SeriesPanel: FC<SeriesPanelProps> = ({ images, activeIndex, onSelect }) => (
  <div className={styles.seriesPanel}>
    <div className={styles.seriesTitle}>Imágenes ({images.length})</div>
    {images.map((img, i) => (
      <div
        key={img.id}
        className={`${styles.seriesItem} ${i === activeIndex ? styles.seriesItemActive : ''}`}
        onClick={() => onSelect(i)}
      >
        <div className={styles.seriesThumb}>
          <div className={styles.seriesThumbCircle} />
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: i === activeIndex ? 600 : 400,
              color: tokens.text,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {img.original_name}
          </div>
          {img.patient_name && (
            <div style={{ fontSize: '10px', color: tokens.textTer }}>{img.patient_name}</div>
          )}
          {img.modality && <ModalityBadge modality={img.modality} />}
        </div>
      </div>
    ))}

    {images[activeIndex] && (
      <div className={styles.caseInfo}>
        <div className={styles.caseInfoTitle}>Info del estudio</div>
        {[
          ['Archivo', images[activeIndex].original_name],
          ['Paciente', images[activeIndex].patient_name || '—'],
          ['Fecha', images[activeIndex].study_date || '—'],
          ['Modalidad', images[activeIndex].modality || '—'],
        ].map(([k, v]) => (
          <div key={k} className={styles.caseInfoRow}>
            <span style={{ color: tokens.textTer }}>{k}</span>
            <span style={{ color: tokens.text, fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);
