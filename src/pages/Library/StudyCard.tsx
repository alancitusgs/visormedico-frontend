import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Study } from '@/types';
import { Card, ModalityBadge } from '@/components';
import { ImagesIcon, TrashIcon } from '@/components/Icon/icons';
import styles from './LibraryPage.module.css';

interface StudyCardProps {
  study: Study;
  onDelete?: (id: number) => void;
}

export const StudyCard: FC<StudyCardProps> = ({ study, onDelete }) => {
  const navigate = useNavigate();

  return (
    <Card noPad style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(`/viewer/${study.id}`)}>
      <div className={styles.cardPreview}>
        <div className={styles.cardPreviewIcon}>
          <ImagesIcon color="rgba(255,255,255,0.2)" />
        </div>
        {onDelete && (
          <button
            className={styles.cardDeleteBtn}
            onClick={(e) => { e.stopPropagation(); onDelete(study.id); }}
          >
            <TrashIcon color="#fff" size={13} />
          </button>
        )}
        {study.modality && (
          <div className={styles.cardBadge}>
            <ModalityBadge modality={study.modality} />
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>{study.original_name}</div>
        <div className={styles.cardMeta}>
          {study.patient_name && <>{study.patient_name} · </>}
          {study.study_date || new Date(study.uploaded_at).toLocaleDateString('es-PE')}
        </div>
      </div>
    </Card>
  );
};
