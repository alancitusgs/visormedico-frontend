import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Study } from '@/types';
import { tokens } from '@/theme';
import { Button } from '@/components';
import { PlusIcon, ChevronIcon } from '@/components/Icon/icons';
import { studiesService } from '@/services/studies.service';
import { StudyCard } from './StudyCard';
import styles from './LibraryPage.module.css';

export const LibraryPage: FC = () => {
  const navigate = useNavigate();
  const [studies, setStudies] = useState<Study[]>([]);
  const [studyToDelete, setStudyToDelete] = useState<Study | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    studiesService.getStudies().then(setStudies).catch(() => {});
  }, []);

  const handleDelete = (id: number) => {
    const study = studies.find((s) => s.id === id);
    if (study) setStudyToDelete(study);
  };

  const confirmDelete = async () => {
    if (!studyToDelete) return;
    setDeleting(true);
    try {
      await studiesService.deleteStudy(studyToDelete.id);
      setStudies((prev) => prev.filter((s) => s.id !== studyToDelete.id));
      setStudyToDelete(null);
    } catch {
      // silently fail — could add toast notification later
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {['Asignatura', 'Modalidad'].map((f) => (
            <button key={f} className={styles.filterBtn}>
              {f} <ChevronIcon color={tokens.textSec} />
            </button>
          ))}
        </div>
        <Button primary small onClick={() => navigate('/upload')}>
          <PlusIcon color="#fff" /> Subir imágenes
        </Button>
      </div>
      <div className={styles.grid}>
        {studies.length === 0 && (
          <p style={{ color: 'var(--color-text-ter)', fontSize: 13, gridColumn: '1/-1' }}>
            No hay imágenes en la biblioteca. Sube una para empezar.
          </p>
        )}
        {studies.map((s) => (
          <StudyCard key={s.id} study={s} onDelete={handleDelete} />
        ))}
      </div>

      {studyToDelete && (
        <div className={styles.overlay} onClick={() => !deleting && setStudyToDelete(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTitle}>Eliminar imagen</div>
            <p className={styles.modalText}>
              ¿Estás seguro de que deseas eliminar <strong>{studyToDelete.original_name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setStudyToDelete(null)}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                className={styles.modalDeleteBtn}
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
