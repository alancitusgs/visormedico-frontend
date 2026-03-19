import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FC } from 'react';
import type { Course } from '@/types';
import { tokens } from '@/theme';
import { Card, Button } from '@/components';
import { ConfirmDeleteModal } from '@/components/Modal/ConfirmDeleteModal';
import { PlusIcon, BookIcon, TrashIcon, PencilIcon } from '@/components/Icon/icons';
import { coursesService } from '@/services/courses.service';
import { CourseFormModal } from './CourseFormModal';
import styles from './CoursesPage.module.css';

const colorFallbacks = [tokens.accent, tokens.purple, tokens.blue, tokens.cyan, tokens.amber];

export const CoursesPage: FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | undefined>();
  const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);

  const load = () => coursesService.getCourses().then(setCourses).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleSaved = (saved: Course) => {
    if (editCourse) {
      setCourses((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
    } else {
      setCourses((prev) => [saved, ...prev]);
    }
    setShowForm(false);
    setEditCourse(undefined);
  };

  const handleDelete = async () => {
    if (!deleteCourse) return;
    await coursesService.deleteCourse(deleteCourse.id);
    setCourses((prev) => prev.filter((c) => c.id !== deleteCourse.id));
    setDeleteCourse(null);
  };

  const openEdit = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    setEditCourse(course);
    setShowForm(true);
  };

  const openDelete = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    setDeleteCourse(course);
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Button primary small onClick={() => { setEditCourse(undefined); setShowForm(true); }}>
          <PlusIcon color="#fff" /> Nueva Asignatura
        </Button>
      </div>
      <div className={styles.grid}>
        {courses.length === 0 && (
          <p style={{ color: 'var(--color-text-ter)', fontSize: 13, gridColumn: '1/-1' }}>
            No hay asignaturas registradas. Crea una para empezar.
          </p>
        )}
        {courses.map((c, i) => {
          const clr = c.color || colorFallbacks[i % colorFallbacks.length];
          return (
            <Card key={c.id} noPad style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(`/courses/${c.id}`)}>
              <div className={styles.colorBar} style={{ background: clr }} />
              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon} style={{ background: `${clr}12` }}>
                    <BookIcon color={clr} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.courseName}>{c.name}</div>
                    {(c.period_name || c.semester) && <div className={styles.courseSemester}>{c.period_name || c.semester}</div>}
                  </div>
                  <div className={styles.cardActions}>
                    <button className={styles.actionBtn} onClick={(e) => openEdit(e, c)} title="Editar">
                      <PencilIcon size={13} color={tokens.textTer} />
                    </button>
                    <button className={styles.actionBtn} onClick={(e) => openDelete(e, c)} title="Eliminar">
                      <TrashIcon size={13} color={tokens.red} />
                    </button>
                  </div>
                </div>
                <div className={styles.courseStats}>
                  <span><strong>{c.images}</strong> imgs</span>
                  <span><strong>{c.collections}</strong> colecciones</span>
                  <span><strong>{c.embeds}</strong> visores</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {showForm && (
        <CourseFormModal
          course={editCourse}
          onSaved={handleSaved}
          onClose={() => { setShowForm(false); setEditCourse(undefined); }}
        />
      )}

      {deleteCourse && (
        <ConfirmDeleteModal
          title="Eliminar asignatura"
          message={`¿Estás seguro de que deseas eliminar "${deleteCourse.name}"? Las colecciones asociadas quedarán sin asignatura.`}
          onConfirm={handleDelete}
          onClose={() => setDeleteCourse(null)}
        />
      )}
    </div>
  );
};
