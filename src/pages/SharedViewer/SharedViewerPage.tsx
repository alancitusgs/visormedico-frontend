import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { publicService, type SharedImageData } from '@/services/public.service';
import { initCornerstone, cornerstone, cornerstoneTools } from '@/lib/cornerstone-init';
import { SvsViewer } from '@/pages/Viewer/SvsViewer';
import type { StudyWithUrls } from '@/types';
import styles from './SharedViewerPage.module.css';

// ---------- Single image viewer ----------

const SharedSingleViewer: FC<{ imageData: SharedImageData }> = ({ imageData }) => {
  const isSvs = imageData.type === 'svs' && imageData.dzi_path;

  if (isSvs) {
    const svsImage: StudyWithUrls = {
      id: imageData.id,
      filename: imageData.filename,
      original_name: '',
      file_size: null,
      patient_name: null,
      patient_id: null,
      study_date: null,
      modality: null,
      uploaded_at: '',
      share_token: null,
      url: imageData.url,
      wadouri: imageData.wadouri,
      dzi_path: imageData.dzi_path,
      file_type: 'svs',
    };

    return (
      <div className={styles.viewer}>
        <SvsViewer image={svsImage} />
      </div>
    );
  }

  return (
    <div className={styles.viewer}>
      <SharedDicomViewer imageData={imageData} />
    </div>
  );
};

// ---------- Collection gallery viewer ----------

const SharedCollectionViewer: FC<{
  collectionName: string;
  images: SharedImageData[];
}> = ({ collectionName, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = images[currentIndex];

  if (!current) return null;

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex((i) => Math.min(images.length - 1, i + 1));

  return (
    <div className={styles.collectionLayout}>
      {/* Sidebar thumbnails */}
      <div className={styles.collectionSidebar}>
        <div className={styles.collectionTitle}>{collectionName}</div>
        <div className={styles.collectionCount}>
          {images.length} {images.length === 1 ? 'imagen' : 'imágenes'}
        </div>
        <div className={styles.thumbnailList}>
          {images.map((img, i) => (
            <button
              key={img.id}
              className={`${styles.thumbnailItem} ${i === currentIndex ? styles.thumbnailItemActive : ''}`}
              onClick={() => setCurrentIndex(i)}
            >
              <div className={styles.thumbnailIcon}>
                {img.type === 'svs' ? 'SVS' : 'DCM'}
              </div>
              <div className={styles.thumbnailInfo}>
                <div className={styles.thumbnailName}>{img.original_name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main viewer */}
      <div className={styles.collectionViewer}>
        <SharedSingleViewer imageData={current} />

        {/* Navigation controls */}
        {images.length > 1 && (
          <div className={styles.navControls}>
            <button
              className={styles.navBtn}
              onClick={goPrev}
              disabled={currentIndex === 0}
            >
              &#8249;
            </button>
            <span className={styles.navCounter}>
              {currentIndex + 1} / {images.length}
            </span>
            <button
              className={styles.navBtn}
              onClick={goNext}
              disabled={currentIndex === images.length - 1}
            >
              &#8250;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Main SharedViewerPage ----------

export const SharedViewerPage: FC = () => {
  const { token } = useParams<{ token: string }>();
  const [imageData, setImageData] = useState<SharedImageData | null>(null);
  const [collectionData, setCollectionData] = useState<{
    collectionName: string;
    images: SharedImageData[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Token no proporcionado');
      setLoading(false);
      return;
    }

    // Try single image first, then collection.
    // Domain-level iframe protection is enforced server-side via CSP
    // frame-ancestors on the /api/viewer/embed/{token} wrapper.
    publicService
      .getSharedImage(token)
      .then(({ image }) => {
        setImageData(image);
        setLoading(false);
      })
      .catch(() => {
        // Not a single image — try collection
        publicService
          .getSharedCollection(token)
          .then(({ collectionName, images }) => {
            setCollectionData({ collectionName, images });
            setLoading(false);
          })
          .catch(() => {
            setError('Enlace inválido o expirado');
            setLoading(false);
          });
      });
  }, [token]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loader}>Cargando visor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          {error}
          <div className={styles.errorSub}>Verifica que el enlace sea correcto</div>
        </div>
      </div>
    );
  }

  // Collection viewer
  if (collectionData) {
    return (
      <div className={styles.page}>
        <SharedCollectionViewer
          collectionName={collectionData.collectionName}
          images={collectionData.images}
        />
        <div className={styles.badge}>VisuMed — Universidad Cayetano Heredia</div>
      </div>
    );
  }

  // Single image viewer
  if (imageData) {
    return (
      <div className={styles.page}>
        <SharedSingleViewer imageData={imageData} />
        <div className={styles.badge}>VisuMed — Universidad Cayetano Heredia</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.errorBox}>
        Contenido no encontrado
        <div className={styles.errorSub}>Verifica que el enlace sea correcto</div>
      </div>
    </div>
  );
};

/** Inline DICOM viewer for the shared page (no sidebar, no toolbar complexity). */
const SharedDicomViewer: FC<{ imageData: SharedImageData }> = ({ imageData }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const enabledRef = useRef(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    initCornerstone();
  }, []);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return;

    cornerstone.enable(element);
    enabledRef.current = true;

    const ro = new ResizeObserver(() => {
      if (enabledRef.current) {
        try { cornerstone.resize(element, true); } catch { /* ignore */ }
      }
    });
    ro.observe(element);

    return () => {
      ro.disconnect();
      enabledRef.current = false;
      try { cornerstone.disable(element); } catch { /* ignore */ }
    };
  }, []);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element || !enabledRef.current || !imageData.wadouri) return;

    cornerstone
      .loadImage(imageData.wadouri)
      .then((csImage) => {
        if (!enabledRef.current) return;
        cornerstone.displayImage(element, csImage);
        cornerstone.resize(element, true);

        try {
          cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
          cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 });
          cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 4 });
        } catch { /* ignore */ }
      })
      .catch(() => setLoadError(true));
  }, [imageData]);

  return (
    <div className={styles.canvasArea}>
      {loadError && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
          <div className={styles.errorBox}>No se pudo cargar la imagen DICOM</div>
        </div>
      )}
      <div
        ref={canvasRef}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
};
