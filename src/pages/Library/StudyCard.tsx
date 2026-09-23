import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Study } from '@/types';
import { Card, ModalityBadge } from '@/components';
import { ImagesIcon, TrashIcon, FolderIcon } from '@/components/Icon/icons';
import styles from './LibraryPage.module.css';

interface StudyCardProps {
  study: Study;
  courseName?: string;
  onDelete?: (id: number) => void;
  onAddToCollection?: (study: Study) => void;
}

const isSvs = (filename: string) => filename.toLowerCase().endsWith('.svs');

const thumbnailUrl = (filename: string) => {
  const stem = filename.replace(/\.[^.]+$/, '');
  return `${import.meta.env.VITE_API_BASE_URL}/tiles/${encodeURIComponent(stem)}/thumbnail`;
};

const formatSize = (bytes: number | null) => {
  if (!bytes) return null;
  const mb = bytes / (1024 * 1024);
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`;
};

export const StudyCard: FC<StudyCardProps> = ({ study, courseName, onDelete, onAddToCollection }) => {
  const navigate = useNavigate();
  const [thumbFailed, setThumbFailed] = useState(false);

  const showThumb = isSvs(study.filename) && !thumbFailed;
  const title = study.display_name || study.original_name;
  const size = formatSize(study.file_size);

  return (
    <Card noPad style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(`/viewer/${study.id}`)}>
      <div className={styles.cardPreview}>
        {showThumb ? (
          <img
            src={thumbnailUrl(study.filename)}
            alt={title}
            className={styles.cardThumb}
            loading="lazy"
            onError={() => setThumbFailed(true)}
          />
        ) : (
          <div className={styles.cardPreviewIcon}>
            <ImagesIcon color="rgba(255,255,255,0.2)" />
          </div>
        )}
        <div className={styles.cardActions}>
          {onAddToCollection && (
            <button
              className={styles.cardActionBtn}
              title="Agregar a colección"
              onClick={(e) => { e.stopPropagation(); onAddToCollection(study); }}
            >
              <FolderIcon color="#fff" size={13} />
            </button>
          )}
          {onDelete && (
            <button
              className={`${styles.cardActionBtn} ${styles.cardActionDanger}`}
              title="Eliminar imagen"
              onClick={(e) => { e.stopPropagation(); onDelete(study.id); }}
            >
              <TrashIcon color="#fff" size={13} />
            </button>
          )}
        </div>
        {study.modality && (
          <div className={styles.cardBadge}>
            <ModalityBadge modality={study.modality} />
          </div>
        )}
        {size && <span className={styles.cardSize}>{size}</span>}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTitle} title={study.original_name}>{title}</div>
        <div className={styles.cardMeta}>
          {study.patient_name && <>{study.patient_name} · </>}
          {study.study_date || new Date(study.uploaded_at).toLocaleDateString('es-PE')}
        </div>
        {courseName && <div className={styles.cardCourse}>{courseName}</div>}
      </div>
    </Card>
  );
};
