import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { FC } from 'react';
import type { CourseDetail, Course } from '@/types';
import { tokens } from '@/theme';
import { Card, Button } from '@/components';
import { ConfirmDeleteModal } from '@/components/Modal/ConfirmDeleteModal';
import { BookIcon, PencilIcon, TrashIcon } from '@/components/Icon/icons';
import { coursesService } from '@/services/courses.service';
import { CourseFormModal } from './CourseFormModal';
import styles from './CourseDetailPage.module.css';

export const CourseDetailPage: FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  // const [showNewCollection, setShowNewCollection] = useState(false);

  const load = () => {
    if (!courseId) return;
    coursesService.getCourse(Number(courseId)).then(setCourse).catch(() => navigate('/courses'));
  };

  useEffect(() => { load(); }, [courseId]);

  if (!course) return null;

  const clr = course.color || tokens.accent;

  const handleCourseEdited = (updated: Course) => {
    setCourse((prev) => prev ? { ...prev, ...updated } : prev);
    setShowEdit(false);
  };

  const handleCourseDeleted = async () => {
    await coursesService.deleteCourse(course.id);
    navigate('/courses');
  };

  // const handleCollectionCreated = (_col: Collection) => {
  //   setShowNewCollection(false);
  //   load();
  // };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/courses')}>
          &larr; Asignaturas
        </button>
        <div className={styles.headerMain}>
          <div className={styles.headerIcon} style={{ background: `${clr}15` }}>
            <BookIcon color={clr} size={24} />
          </div>
          <div>
            <h1 className={styles.title}>{course.name}</h1>
            {(course.period_name || course.semester) && <span className={styles.subtitle}>{course.period_name || course.semester}</span>}
          </div>
          <div className={styles.headerActions}>
            <Button small onClick={() => setShowEdit(true)}>
              <PencilIcon size={13} color={tokens.textSec} /> Editar
            </Button>
            <Button small onClick={() => setShowDelete(true)}>
              <TrashIcon size={13} color={tokens.red} /> Eliminar
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <div className={styles.statValue}>{course.images}</div>
          <div className={styles.statLabel}>Imágenes</div>
        </Card>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <div className={styles.statValue}>{course.embeds}</div>
          <div className={styles.statLabel}>Visores</div>
        </Card>
      </div>

      {showEdit && (
        <CourseFormModal course={course} onSaved={handleCourseEdited} onClose={() => setShowEdit(false)} />
      )}

      {showDelete && (
        <ConfirmDeleteModal
          title="Eliminar asignatura"
          message={`¿Eliminar "${course.name}"?`}
          onConfirm={handleCourseDeleted}
          onClose={() => setShowDelete(false)}
        />
      )}

      {/* {showNewCollection && (
        <CollectionFormModal
          collection={{ id: 0, name: '', course: course.name, course_id: course.id, studyCount: 0 }}
          onSaved={handleCollectionCreated}
          onClose={() => setShowNewCollection(false)}
        />
      )} */}
    </div>
  );
};
