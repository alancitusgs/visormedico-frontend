import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import type { StudyWithUrls } from '@/types';
import { studiesService } from '@/services/studies.service';
import { SeriesPanel } from './SeriesPanel';
import { ViewerCanvas } from './ViewerCanvas';
import { MetadataPanel } from './MetadataPanel';
import styles from './ViewerPage.module.css';

export const ViewerPage: FC = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const [images, setImages] = useState<StudyWithUrls[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studiesService
      .getViewerImages()
      .then((data) => {
        setImages(data);
        // If studyId is provided, find and select that image
        if (studyId) {
          const idx = data.findIndex((img) => img.id === Number(studyId));
          if (idx >= 0) setActiveIndex(idx);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [studyId]);

  const activeImage = images[activeIndex] ?? null;

  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
          Cargando visor...
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={styles.page}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 16 }}>No hay imágenes disponibles</div>
          <div style={{ fontSize: 13 }}>Sube una imagen DICOM para visualizarla aquí</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <SeriesPanel
        images={images}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
      />
      <ViewerCanvas image={activeImage} />
      <MetadataPanel image={activeImage} />
    </div>
  );
};
