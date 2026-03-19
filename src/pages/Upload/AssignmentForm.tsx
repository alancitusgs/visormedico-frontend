import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Course } from '@/types';
import { Card } from '@/components';
import { coursesService } from '@/services/courses.service';
import styles from './UploadPage.module.css';

interface Props {
  onAssignment: (courseId: number | null) => void;
}

export const AssignmentForm: FC<Props> = ({ onAssignment }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState<number | ''>('');

  useEffect(() => {
    coursesService.getCourses().then(setCourses).catch(() => {});
  }, []);

  const handleCourseChange = (value: string) => {
    const id = value ? Number(value) : '';
    setCourseId(id);
    onAssignment(id || null);
  };

  return (
    <Card style={{ marginTop: 16 }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: 14 }}>
        Asignar a
      </div>
      <div>
        <label className={styles.fieldLabel}>Asignatura</label>
        <select
          className={styles.select}
          value={courseId}
          onChange={(e) => handleCourseChange(e.target.value)}
        >
          <option value="">Seleccionar asignatura</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </Card>
  );
};
