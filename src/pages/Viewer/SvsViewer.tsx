import { useRef, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import OpenSeadragon from 'openseadragon';
import type { StudyWithUrls } from '@/types';
import { studiesService } from '@/services/studies.service';
import { annotationsService } from '@/services/annotations.service';
import { SvsToolbarProvider, useSvsToolbar } from './SvsToolbar/SvsToolbarContext';
import { SvsToolbar } from './SvsToolbar/SvsToolbar';
import { AnnotationCanvas } from './SvsOverlay/AnnotationCanvas';
import { Scalebar } from './SvsWidgets/Scalebar';
import { Magnifier } from './SvsWidgets/Magnifier';
import { useScreenshot } from './SvsWidgets/ScreenshotButton';
import type { Annotation } from './SvsOverlay/types';
import styles from './ViewerPage.module.css';

interface SvsViewerProps {
  image: StudyWithUrls;
}

export const SvsViewer: FC<SvsViewerProps> = ({ image }) => (
  <SvsToolbarProvider imageId={image.id}>
    <SvsViewerInner image={image} />
  </SvsToolbarProvider>
);

/** Extract the stem (filename without .svs extension) from a DZI path */
function extractStem(dziPath: string | null): string | null {
  if (!dziPath) return null;
  const match = dziPath.match(/\/([^/]+)\.dzi$/);
  return match?.[1] ?? null;
}

const SvsViewerInner: FC<SvsViewerProps> = ({ image }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const annotationCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const { state, dispatch, viewerRef, imageId } = useSvsToolbar();

  const getAnnotationCanvas = useCallback(
    () => annotationCanvasRef.current,
    [],
  );

  // Screenshot capture hook
  useScreenshot(viewerRef, getAnnotationCanvas);

  // Load saved annotations from backend
  useEffect(() => {
    if (!imageId) return;
    annotationsService.getAnnotations(imageId).then((saved) => {
      const loaded: Annotation[] = saved.map((a) => ({
        id: String(a.id),
        type: a.type as Annotation['type'],
        points: a.points,
        color: a.color,
        strokeWidth: a.stroke_width,
        label: a.label ?? undefined,
      }));
      dispatch({ type: 'LOAD_ANNOTATIONS', annotations: loaded });
    }).catch(() => {
      // Could not load — start with empty annotations
    });
  }, [imageId, dispatch]);

  // Initialize OpenSeadragon
  useEffect(() => {
    if (!containerRef.current || !image.dzi_path) return;

    // Use WebGL for sharper rendering and better compositing.
    // Fall back to canvas on devices where WebGL is unavailable.
    const dpr = window.devicePixelRatio || 1;

    const viewer = OpenSeadragon({
      element: containerRef.current,
      tileSources: image.dzi_path,
      prefixUrl: '',
      drawer: ['webgl', 'canvas'],
      crossOriginPolicy: 'Anonymous',
      showNavigator: true,
      navigatorPosition: 'BOTTOM_RIGHT',
      navigatorSizeRatio: 0.15,
      showNavigationControl: false,
      minZoomLevel: 0.1,
      maxZoomLevel: 200,
      visibilityRatio: 0.5,
      constrainDuringPan: false,
      animationTime: 0.3,
      immediateRender: true,
      gestureSettingsMouse: {
        scrollToZoom: true,
        clickToZoom: true,
        dblClickToZoom: true,
        flickEnabled: true,
      },
      gestureSettingsTouch: {
        pinchToZoom: true,
        flickEnabled: true,
      },
      // Render at the display's native pixel density so tiles are sharp
      // on HiDPI / Retina screens (2×, 3×, etc.).
      // Property exists at runtime but is missing from OSD 6 type defs.
      ...({ pixelDensityRatio: dpr } as any),
    } as OpenSeadragon.Options);

    viewerRef.current = viewer;

    // For the canvas fallback: disable image smoothing at high zoom so
    // individual pixels stay crisp instead of being bilinear-blurred.
    viewer.addHandler('tile-drawing', (event: Record<string, any>) => {
      const ctx: CanvasRenderingContext2D | null =
        event.rendered?.getContext?.('2d') ?? event.context ?? null;
      if (!ctx) return;
      const zoom = viewer.viewport.getZoom(true);
      const homeZoom = viewer.viewport.getHomeZoom();
      const ratio = zoom / homeZoom;
      const sharp = ratio > 4;
      ctx.imageSmoothingEnabled = !sharp;
    });

    viewer.addHandler('zoom', () => {
      const currentZoom = viewer.viewport.getZoom();
      const homeZoom = viewer.viewport.getHomeZoom();
      dispatch({ type: 'SET_ZOOM', level: Math.round((currentZoom / homeZoom) * 100) });
    });

    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [image.dzi_path, dispatch, viewerRef]);

  // Fetch slide properties (MPP + objective power) and adjust viewer limits
  useEffect(() => {
    const stem = extractStem(image.dzi_path);
    if (!stem) return;
    studiesService.getSlideProperties(stem).then((props) => {
      if (props.mpp) dispatch({ type: 'SET_MPP', mpp: props.mpp });

      // Allow digital zoom up to 3× beyond the native objective power.
      // This matches commercial viewers like PathPresenter that let users
      // zoom past the optical resolution for fine inspection.
      const viewer = viewerRef.current;
      if (viewer && props.objective_power) {
        const homeZoom = viewer.viewport.getHomeZoom();
        const nativeMax = homeZoom * props.objective_power * 3;
        (viewer.viewport as any).maxZoomLevel = Math.min(nativeMax, 500);
      }
    }).catch(() => {
      // MPP not available for this slide
    });
  }, [image.dzi_path, dispatch, viewerRef]);

  // Callback: persist a new annotation to backend after it's added to state
  const handleAnnotationAdded = useCallback(
    (ann: Annotation) => {
      dispatch({ type: 'ADD_ANNOTATION', annotation: ann });
      if (!imageId) return;
      annotationsService.createAnnotation(imageId, {
        type: ann.type,
        points: ann.points,
        color: ann.color,
        stroke_width: ann.strokeWidth,
        label: ann.label ?? null,
      }).catch(() => {
        // Best-effort persistence; annotation stays in local state
      });
    },
    [dispatch, imageId],
  );

  // Callback: clear all annotations (local + backend)
  const handleClearAnnotations = useCallback(() => {
    dispatch({ type: 'CLEAR_ANNOTATIONS' });
    if (!imageId) return;
    annotationsService.clearAnnotations(imageId).catch(() => {
      // Best-effort
    });
  }, [dispatch, imageId]);

  return (
    <div className={styles.canvas}>
      <SvsToolbar onClearAnnotations={handleClearAnnotations} />

      <div className={styles.canvasArea}>
        {/* Info overlays */}
        <div className={styles.overlayTL}>
          {image.original_name}
          {image.patient_name && <><br />{image.patient_name}</>}
        </div>
        <div className={styles.overlayTR}>
          {image.modality && <>{image.modality}<br /></>}
          {image.study_date || ''}
        </div>
        <div className={styles.overlayBL}>
          WSI (Whole Slide Image)
        </div>
        <div className={styles.overlayBR}>
          Zoom: {state.zoomLevel}%
        </div>

        {/* OpenSeadragon container */}
        <div
          ref={containerRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            background: '#12151e',
          }}
        />

        {/* Annotation canvas overlay */}
        <AnnotationCanvas
          onCanvasRef={(el) => { annotationCanvasRef.current = el; }}
          onAnnotationAdded={handleAnnotationAdded}
        />

        {/* Scalebar */}
        {state.mpp && <Scalebar />}

        {/* Magnifier */}
        {state.magnifierEnabled && <Magnifier />}
      </div>
    </div>
  );
};
