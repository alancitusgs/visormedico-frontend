import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Collection, Course } from '@/types';
import { Modal } from '@/components';
import { collectionsService } from '@/services/collections.service';
import { coursesService } from '@/services/courses.service';
import styles from '@/components/Modal/ModalForm.module.css';

interface Props {
  collection?: Collection;
  onSaved: (collection: Collection) => void;
  onClose: () => void;
}

export const CollectionFormModal: FC<Props> = ({ collection, onSaved, onClose }) => {
  const isEdit = !!collection;
  const [name, setName] = useState(collection?.name ?? '');
  const [courseId, setCourseId] = useState<number | ''>(collection?.course_id ?? '');
  const [courses, setCourses] = useState<Course[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    coursesService.getCourses().then(setCourses).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('El nombre es requerido.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const body = { name: name.trim(), course_id: courseId || null };
      const result = isEdit
        ? await collectionsService.updateCollection(collection!.id, body)
        : await collectionsService.createCollection(body);
      onSaved(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al guardar la colección.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Editar Colección' : 'Nueva Colección'} onClose={onClose}>
      <div className={styles.field}>
        <label className={styles.label}>Nombre</label>
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Patología Torácica"
          autoFocus
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Asignatura (opcional)</label>
        <select
          className={styles.select}
          value={courseId}
          onChange={(e) => setCourseId(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">Sin asignatura</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        <button className={styles.cancelBtn} onClick={onClose} disabled={saving}>
          Cancelar
        </button>
        <button className={styles.submitBtn} onClick={handleSubmit} disabled={saving || !name.trim()}>
          {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear colección'}
        </button>
      </div>
    </Modal>
  );
};
