import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Course, Period } from '@/types';
import { Modal } from '@/components';
import { tokens } from '@/theme';
import { coursesService } from '@/services/courses.service';
import { periodsService } from '@/services/periods.service';
import styles from '@/components/Modal/ModalForm.module.css';

const COLORS = [tokens.accent, tokens.purple, tokens.blue, tokens.cyan, tokens.amber, tokens.green, tokens.red];

interface Props {
  course?: Course;
  onSaved: (course: Course) => void;
  onClose: () => void;
}

export const CourseFormModal: FC<Props> = ({ course, onSaved, onClose }) => {
  const isEdit = !!course;
  const [name, setName] = useState(course?.name ?? '');
  const [periodId, setPeriodId] = useState<number | ''>(course?.period_id ?? '');
  const [color, setColor] = useState(course?.color ?? tokens.accent);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    periodsService.getPeriods().then(setPeriods).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('El nombre es requerido.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: name.trim(),
        period_id: periodId || null,
        color,
      };
      const result = isEdit
        ? await coursesService.updateCourse(course!.id, payload)
        : await coursesService.createCourse(payload);
      onSaved(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al guardar la asignatura.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Editar Asignatura' : 'Nueva Asignatura'} onClose={onClose}>
      <div className={styles.field}>
        <label className={styles.label}>Nombre</label>
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Anatomía Patológica"
          autoFocus
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Periodo</label>
        <select
          className={styles.select}
          value={periodId}
          onChange={(e) => setPeriodId(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">Sin periodo</option>
          {periods.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Color</label>
        <div className={styles.colorRow}>
          {COLORS.map((c) => (
            <div
              key={c}
              className={`${styles.colorSwatch} ${color === c ? styles.colorSwatchActive : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        <button className={styles.cancelBtn} onClick={onClose} disabled={saving}>
          Cancelar
        </button>
        <button className={styles.submitBtn} onClick={handleSubmit} disabled={saving || !name.trim()}>
          {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear asignatura'}
        </button>
      </div>
    </Modal>
  );
};
