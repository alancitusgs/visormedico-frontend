import { useRef, useEffect, useCallback } from 'react';
import OpenSeadragon from 'openseadragon';
import type { Annotation, DrawingState } from './types';
import {
  drawFreehand,
  drawRectangle,
  drawPolygon,
  drawLine,
  drawRuler,
} from './drawHelpers';

interface UseAnnotationCanvasOpts {
  viewerRef: React.RefObject<OpenSeadragon.Viewer | null>;
  annotations: Annotation[];
  drawingState: DrawingState | null;
}

/** Convert a point from image coordinates to viewer-element (screen) coordinates. */
function toScreen(viewer: OpenSeadragon.Viewer, x: number, y: number) {
  const pt = viewer.viewport.imageToViewerElementCoordinates(
    new OpenSeadragon.Point(x, y),
  );
  return { x: pt.x, y: pt.y };
}

function renderAnnotation(
  ctx: CanvasRenderingContext2D,
  viewer: OpenSeadragon.Viewer,
  ann: Annotation,
) {
  const style = { color: ann.color, strokeWidth: ann.strokeWidth };
  const pts = ann.points.map((p) => toScreen(viewer, p.x, p.y));

  switch (ann.type) {
    case 'freehand':
      drawFreehand(ctx, pts, style);
      break;
    case 'rectangle':
      if (pts.length >= 2) drawRectangle(ctx, pts[0]!, pts[1]!, style);
      break;
    case 'polygon':
      drawPolygon(ctx, pts, true, style);
      break;
    case 'line':
      if (pts.length >= 2) drawLine(ctx, pts[0]!, pts[1]!, style);
      break;
    case 'ruler':
      if (pts.length >= 2)
        drawRuler(ctx, pts[0]!, pts[1]!, ann.label || '', style);
      break;
  }
}

function renderDrawing(
  ctx: CanvasRenderingContext2D,
  viewer: OpenSeadragon.Viewer,
  ds: DrawingState,
) {
  const style = { color: '#00ff00', strokeWidth: 2 };
  const pts = ds.points.map((p) => toScreen(viewer, p.x, p.y));

  switch (ds.type) {
    case 'freehand':
      drawFreehand(ctx, pts, style);
      break;
    case 'rectangle':
      if (pts.length >= 2) drawRectangle(ctx, pts[0]!, pts[pts.length - 1]!, style);
      break;
    case 'polygon':
      drawPolygon(ctx, pts, false, style);
      break;
    case 'line':
      if (pts.length >= 2) drawLine(ctx, pts[0]!, pts[pts.length - 1]!, style);
      break;
    case 'ruler':
      if (pts.length >= 2) drawRuler(ctx, pts[0]!, pts[pts.length - 1]!, '', style);
      break;
  }
}

export function useAnnotationCanvas({ viewerRef, annotations, drawingState }: UseAnnotationCanvasOpts) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const viewer = viewerRef.current;
    if (!canvas || !viewer) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;

    // Size canvas to container accounting for DPR
    const w = rect.width;
    const h = rect.height;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Render all saved annotations
    for (const ann of annotations) {
      renderAnnotation(ctx, viewer, ann);
    }

    // Render in-progress drawing
    if (drawingState && drawingState.points.length > 0) {
      renderDrawing(ctx, viewer, drawingState);
    }
  }, [viewerRef, annotations, drawingState]);

  // Subscribe to OSD viewport changes to redraw
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handler = () => redraw();
    viewer.addHandler('update-viewport', handler);
    viewer.addHandler('open', handler);

    // Initial draw
    redraw();

    return () => {
      viewer.removeHandler('update-viewport', handler);
      viewer.removeHandler('open', handler);
    };
  }, [viewerRef, redraw]);

  // Redraw when annotations or drawingState changes
  useEffect(() => {
    redraw();
  }, [redraw]);

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas?.parentElement) return;

    const ro = new ResizeObserver(() => redraw());
    ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, [redraw]);

  return { canvasRef, redraw };
}
