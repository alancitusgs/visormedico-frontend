import { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Study, Course } from '@/types';
import { Button } from '@/components';
import { PlusIcon, SearchIcon, CheckIcon } from '@/components/Icon/icons';
import { studiesService } from '@/services/studies.service';
import { coursesService } from '@/services/courses.service';
import { StudyCard } from './StudyCard';
import { AddToCollectionModal } from './AddToCollectionModal';
import styles from './LibraryPage.module.css';

export const LibraryPage: FC = () => {
  const navigate = useNavigate();
  const [studies, setStudies] = useState<Study[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState<number | ''>('');
  const [modalityFilter, setModalityFilter] = useState('');
  const [studyToDelete, setStudyToDelete] = useState<Study | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [studyToCollect, setStudyToCollect] = useState<Study | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    studiesService.getStudies()
      .then(setStudies)
      .catch(() => {})
      .finally(() => setLoading(false));
    coursesService.getCourses().then(setCourses).catch(() => {});
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const courseNames = useMemo(
    () => new Map(courses.map((c) => [c.id, c.name])),
    [courses],
  );

  const modalities = useMemo(
    () => [...new Set(studies.map((s) => s.modality).filter(Boolean))] as string[],
    [studies],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return studies.filter((s) => {
      if (q) {
        const haystack = `${s.display_name ?? ''} ${s.original_name} ${s.patient_name ?? ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (courseFilter !== '' && s.course_id !== courseFilter) return false;
      if (modalityFilter && s.modality !== modalityFilter) return false;
      return true;
    });
  }, [studies, search, courseFilter, modalityFilter]);

  const hasFilters = search.trim() !== '' || courseFilter !== '' || modalityFilter !== '';

  const clearFilters = () => {
    setSearch('');
    setCourseFilter('');
    setModalityFilter('');
  };

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
      setToast('Imagen eliminada.');
    } catch {
      setToast('No se pudo eliminar la imagen.');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddedToCollection = (collectionName: string) => {
    setStudyToCollect(null);
    setToast(`Imagen agregada a "${collectionName}".`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <SearchIcon color="var(--color-text-ter)" />
            <input
              className={styles.searchInput}
              placeholder="Buscar por nombre o paciente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className={styles.filterSelect}
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value ? Number(e.target.value) : '')}
            aria-label="Filtrar por asignatura"
          >
            <option value="">Asignatura: todas</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            className={styles.filterSelect}
            value={modalityFilter}
            onChange={(e) => setModalityFilter(e.target.value)}
            aria-label="Filtrar por modalidad"
          >
            <option value="">Modalidad: todas</option>
            {modalities.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {hasFilters && (
            <button className={styles.clearBtn} onClick={clearFilters}>
              Limpiar filtros
            </button>
          )}
        </div>
        <div className={styles.toolbarRight}>
          {!loading && (
            <span className={styles.resultCount}>
              {filtered.length} de {studies.length} imágenes
            </span>
          )}
          <Button primary small onClick={() => navigate('/upload')}>
            <PlusIcon color="#fff" /> Subir imágenes
          </Button>
        </div>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonPreview} />
              <div className={styles.skeletonBody}>
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLineShort} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          {studies.length === 0 ? (
            <>
              <p className={styles.emptyTitle}>No hay imágenes en la biblioteca</p>
              <p className={styles.emptyText}>Sube tu primera imagen DICOM o SVS para empezar.</p>
              <Button primary small onClick={() => navigate('/upload')}>
                <PlusIcon color="#fff" /> Subir imágenes
              </Button>
            </>
          ) : (
            <>
              <p className={styles.emptyTitle}>Sin resultados</p>
              <p className={styles.emptyText}>Ninguna imagen coincide con los filtros actuales.</p>
              <button className={styles.clearBtn} onClick={clearFilters}>Limpiar filtros</button>
            </>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((s) => (
            <StudyCard
              key={s.id}
              study={s}
              courseName={s.course_id ? courseNames.get(s.course_id) : undefined}
              onDelete={handleDelete}
              onAddToCollection={setStudyToCollect}
            />
          ))}
        </div>
      )}

      {studyToCollect && (
        <AddToCollectionModal
          study={studyToCollect}
          onDone={handleAddedToCollection}
          onClose={() => setStudyToCollect(null)}
        />
      )}

      {studyToDelete && (
        <div className={styles.overlay} onClick={() => !deleting && setStudyToDelete(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTitle}>Eliminar imagen</div>
            <p className={styles.modalText}>
              ¿Estás seguro de que deseas eliminar <strong>{studyToDelete.display_name || studyToDelete.original_name}</strong>? Esta acción no se puede deshacer.
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

      {toast && (
        <div className={styles.toast}>
          <CheckIcon color="#fff" size={13} /> {toast}
        </div>
      )}
    </div>
  );
};
