import { useRef, useEffect, useCallback } from 'react';
import OpenSeadragon from 'openseadragon';
import type { Annotation, DrawingState, Point } from './types';
import type { SvsToolName } from '../SvsToolbar/tools';
import { formatDistance } from './drawHelpers';

interface UseAnnotationDrawOpts {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  viewerRef: React.RefObject<OpenSeadragon.Viewer | null>;
  activeTool: SvsToolName;
  mpp: number | null;
  onAddAnnotation: (ann: Annotation) => void;
  onDrawingStateChange: (ds: DrawingState | null) => void;
  redraw: () => void;
}

function screenToImage(viewer: OpenSeadragon.Viewer, x: number, y: number): Point {
  const pt = viewer.viewport.viewerElementToImageCoordinates(
    new OpenSeadragon.Point(x, y),
  );
  return { x: pt.x, y: pt.y };
}

function createAnnotation(
  type: Annotation['type'],
  points: Point[],
  mpp: number | null,
): Annotation {
  const ann: Annotation = {
    id: crypto.randomUUID(),
    type,
    points,
    color: '#00ff00',
    strokeWidth: 2,
  };

  if (type === 'ruler' && points.length >= 2 && mpp) {
    const dx = points[1]!.x - points[0]!.x;
    const dy = points[1]!.y - points[0]!.y;
    const distPx = Math.sqrt(dx * dx + dy * dy);
    ann.label = formatDistance(distPx * mpp);
  }

  return ann;
}

export function useAnnotationDraw({
  canvasRef,
  viewerRef,
  activeTool,
  mpp,
  onAddAnnotation,
  onDrawingStateChange,
  redraw,
}: UseAnnotationDrawOpts) {
  const drawingRef = useRef<DrawingState | null>(null);
  const isDrawingRef = useRef(false);

  // Get the element-relative position from a pointer event
  const getPos = useCallback(
    (e: PointerEvent): Point | null => {
      const viewer = viewerRef.current;
      const canvas = canvasRef.current;
      if (!viewer || !canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return screenToImage(viewer, x, y);
    },
    [viewerRef, canvasRef],
  );

  // Finalize the current drawing
  const finalize = useCallback(
    (type: Annotation['type'], points: Point[]) => {
      if (points.length < 2) {
        drawingRef.current = null;
        onDrawingStateChange(null);
        return;
      }
      const ann = createAnnotation(type, points, mpp);
      onAddAnnotation(ann);
      drawingRef.current = null;
      onDrawingStateChange(null);
      isDrawingRef.current = false;
    },
    [mpp, onAddAnnotation, onDrawingStateChange],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Freehand, rectangle, line, ruler ──
    const onPointerDown = (e: PointerEvent) => {
      if (activeTool === 'polygon') return; // polygon uses click, not pointerdown
      if (!['freehand', 'rectangle', 'line', 'ruler'].includes(activeTool)) return;

      const pt = getPos(e);
      if (!pt) return;

      isDrawingRef.current = true;
      const ds: DrawingState = { type: activeTool as Annotation['type'], points: [pt] };
      drawingRef.current = ds;
      onDrawingStateChange(ds);
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDrawingRef.current || !drawingRef.current) return;
      const pt = getPos(e);
      if (!pt) return;

      const ds = drawingRef.current;

      if (ds.type === 'freehand') {
        ds.points.push(pt);
      } else {
        // rectangle, line, ruler — keep first point + update second
        if (ds.points.length === 1) {
          ds.points.push(pt);
        } else {
          ds.points[1] = pt;
        }
      }

      onDrawingStateChange({ ...ds, points: [...ds.points] });
      redraw();
    };

    const onPointerUp = (_e: PointerEvent) => {
      if (!isDrawingRef.current || !drawingRef.current) return;
      const ds = drawingRef.current;
      isDrawingRef.current = false;

      const first = ds.points[0]!;
      const last = ds.points[ds.points.length - 1]!;

      if (ds.type === 'freehand') {
        finalize('freehand', ds.points);
      } else if (ds.type === 'rectangle' && ds.points.length >= 2) {
        finalize('rectangle', [first, last]);
      } else if (ds.type === 'line' && ds.points.length >= 2) {
        finalize('line', [first, last]);
      } else if (ds.type === 'ruler' && ds.points.length >= 2) {
        finalize('ruler', [first, last]);
      } else {
        drawingRef.current = null;
        onDrawingStateChange(null);
      }
    };

    // ── Polygon ──
    const onClickPolygon = (e: MouseEvent) => {
      if (activeTool !== 'polygon') return;

      const viewer = viewerRef.current;
      if (!viewer) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pt = screenToImage(viewer, x, y);

      if (!drawingRef.current) {
        // Start new polygon
        drawingRef.current = { type: 'polygon', points: [pt] };
        onDrawingStateChange({ type: 'polygon', points: [pt] });
      } else {
        // Add vertex
        drawingRef.current.points.push(pt);
        onDrawingStateChange({
          ...drawingRef.current,
          points: [...drawingRef.current.points],
        });
      }
      redraw();
    };

    const onDblClickPolygon = (_e: MouseEvent) => {
      if (activeTool !== 'polygon' || !drawingRef.current) return;
      finalize('polygon', drawingRef.current.points);
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('click', onClickPolygon);
    canvas.addEventListener('dblclick', onDblClickPolygon);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('click', onClickPolygon);
      canvas.removeEventListener('dblclick', onDblClickPolygon);
    };
  }, [activeTool, canvasRef, viewerRef, getPos, finalize, onDrawingStateChange, redraw]);

  // Reset drawing state when tool changes
  useEffect(() => {
    drawingRef.current = null;
    isDrawingRef.current = false;
    onDrawingStateChange(null);
  }, [activeTool, onDrawingStateChange]);
}
