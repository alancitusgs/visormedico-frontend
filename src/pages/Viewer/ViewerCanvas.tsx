import { useRef, useEffect, useState, useCallback } from 'react';
import type { FC } from 'react';
import type { StudyWithUrls } from '@/types';
import { initCornerstone, cornerstone, cornerstoneTools } from '@/lib/cornerstone-init';
import { ViewerToolbar } from './ViewerToolbar';
import { SvsViewer } from './SvsViewer';
import styles from './ViewerPage.module.css';

interface ViewerCanvasProps {
  image: StudyWithUrls | null;
}

type ToolName = 'Wwwc' | 'Zoom' | 'Pan' | 'Rotate' | 'Length';

export const ViewerCanvas: FC<ViewerCanvasProps> = ({ image }) => {
  const isSvs = image?.file_type === 'svs' || image?.dzi_path;

  // All hooks MUST be called before any conditional return (Rules of Hooks)
  const canvasRef = useRef<HTMLDivElement>(null);
  const enabledRef = useRef(false);
  const imageLoadedRef = useRef(false);
  const [viewport, setViewport] = useState({ ww: 0, wc: 0, zoom: 100 });
  const [activeTool, setActiveTool] = useState<ToolName>('Wwwc');
  const [error, setError] = useState<string | null>(null);
  const [inverted, setInverted] = useState(false);

  // Initialize Cornerstone once
  useEffect(() => {
    if (isSvs) return;
    initCornerstone();
  }, [isSvs]);

  // Enable cornerstone element (separate from image loading)
  useEffect(() => {
    if (isSvs) return;
    const element = canvasRef.current;
    if (!element) return;

    cornerstone.enable(element);
    enabledRef.current = true;

    const ro = new ResizeObserver(() => {
      if (enabledRef.current && imageLoadedRef.current) {
        try {
          cornerstone.resize(element, true);
        } catch {
          // ignore if no image displayed yet
        }
      }
    });
    ro.observe(element);

    return () => {
      ro.disconnect();
      enabledRef.current = false;
      imageLoadedRef.current = false;
      try {
        cornerstone.disable(element);
      } catch {
        // ignore
      }
    };
  }, [isSvs]);

  // Load and display image when it changes
  useEffect(() => {
    if (isSvs) return;
    const element = canvasRef.current;
    if (!element || !image || !enabledRef.current) return;

    setError(null);
    setInverted(false);
    const imageId = `wadouri:/uploads/dicom/${image.filename}`;

    cornerstone
      .loadImage(imageId)
      .then((csImage) => {
        if (!enabledRef.current) return;

        cornerstone.displayImage(element, csImage);
        imageLoadedRef.current = true;

        cornerstone.resize(element, true);

        const vp = cornerstone.getViewport(element);
        if (vp?.voi) {
          setViewport({
            ww: Math.round(vp.voi.windowWidth),
            wc: Math.round(vp.voi.windowCenter),
            zoom: Math.round((vp.scale ?? 1) * 100),
          });
        }

        try {
          cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
          cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 });
          cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 4 });
        } catch {
          // tools might not be registered yet
        }
      })
      .catch(() => {
        setError('No se pudo cargar la imagen DICOM');
      });

    const onRendered = () => {
      const updatedVp = cornerstone.getViewport(element);
      if (updatedVp?.voi) {
        setViewport({
          ww: Math.round(updatedVp.voi.windowWidth),
          wc: Math.round(updatedVp.voi.windowCenter),
          zoom: Math.round((updatedVp.scale ?? 1) * 100),
        });
      }
    };
    element.addEventListener('cornerstoneimagerendered', onRendered);

    return () => {
      element.removeEventListener('cornerstoneimagerendered', onRendered);
    };
  }, [image, isSvs]);

  const handleToolChange = useCallback((tool: ToolName) => {
    if (!enabledRef.current) return;
    setActiveTool(tool);
    try {
      cornerstoneTools.setToolActive(tool, { mouseButtonMask: 1 });
    } catch {
      // ignore
    }
  }, []);

  const handleReset = useCallback(() => {
    const element = canvasRef.current;
    if (!element || !enabledRef.current) return;
    cornerstone.reset(element);
    setInverted(false);
  }, []);

  const handlePreset = useCallback((ww: number, wc: number) => {
    const element = canvasRef.current;
    if (!element || !enabledRef.current) return;
    const vp = cornerstone.getViewport(element);
    if (!vp) return;
    if (!vp.voi) return;
    vp.voi.windowWidth = ww;
    vp.voi.windowCenter = wc;
    cornerstone.setViewport(element, vp);
  }, []);

  const handleInvert = useCallback(() => {
    const element = canvasRef.current;
    if (!element || !enabledRef.current) return;
    const vp = cornerstone.getViewport(element);
    if (!vp) return;
    vp.invert = !vp.invert;
    cornerstone.setViewport(element, vp);
    setInverted((prev) => !prev);
  }, []);

  // SVS path: render OpenSeadragon viewer
  if (isSvs && image?.dzi_path) {
    return <SvsViewer image={image} />;
  }

  // DICOM path: render Cornerstone viewer
  return (
    <div className={styles.canvas}>
      <ViewerToolbar
        activeTool={activeTool}
        onToolChange={handleToolChange}
        onReset={handleReset}
        onPreset={handlePreset}
        onInvert={handleInvert}
        inverted={inverted}
      />

      <div className={styles.canvasArea}>
        {image && (
          <>
            <div className={styles.overlayTL}>
              {image.original_name}
              {image.patient_name && <><br />{image.patient_name}</>}
            </div>
            <div className={styles.overlayTR}>
              {image.modality && <>{image.modality}<br /></>}
              {image.study_date || ''}
            </div>
            <div className={styles.overlayBL}>
              WC: {viewport.wc} / WW: {viewport.ww}
            </div>
            <div className={styles.overlayBR}>
              Zoom: {viewport.zoom}%
            </div>
          </>
        )}

        {error && (
          <div style={{ position: 'absolute', color: '#f87171', fontSize: 14, textAlign: 'center', zIndex: 5 }}>
            {error}
          </div>
        )}

        <div
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </div>
    </div>
  );
};
