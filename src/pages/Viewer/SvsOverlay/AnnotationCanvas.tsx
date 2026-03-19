import { useState, useCallback, useEffect, type FC } from 'react';
import { useSvsToolbar } from '../SvsToolbar/SvsToolbarContext';
import { isDrawingTool } from '../SvsToolbar/tools';
import { useAnnotationCanvas } from './useAnnotationCanvas';
import { useAnnotationDraw } from './useAnnotationDraw';
import type { Annotation, DrawingState } from './types';

interface AnnotationCanvasProps {
  onCanvasRef?: (el: HTMLCanvasElement | null) => void;
  /** If provided, this callback is used instead of dispatching ADD_ANNOTATION directly. */
  onAnnotationAdded?: (ann: Annotation) => void;
}

export const AnnotationCanvas: FC<AnnotationCanvasProps> = ({ onCanvasRef, onAnnotationAdded }) => {
  const { state, dispatch, viewerRef } = useSvsToolbar();
  const [drawingState, setDrawingState] = useState<DrawingState | null>(null);

  const { canvasRef, redraw } = useAnnotationCanvas({
    viewerRef,
    annotations: state.annotations,
    drawingState,
  });

  // Expose canvas ref to parent for screenshot compositing
  useEffect(() => {
    onCanvasRef?.(canvasRef.current);
  }, [canvasRef, onCanvasRef]);

  const handleAddAnnotation = useCallback(
    (ann: Annotation) => {
      if (onAnnotationAdded) {
        onAnnotationAdded(ann);
      } else {
        dispatch({ type: 'ADD_ANNOTATION', annotation: ann });
      }
    },
    [dispatch, onAnnotationAdded],
  );

  useAnnotationDraw({
    canvasRef,
    viewerRef,
    activeTool: state.activeTool,
    mpp: state.mpp,
    onAddAnnotation: handleAddAnnotation,
    onDrawingStateChange: setDrawingState,
    redraw,
  });

  const active = isDrawingTool(state.activeTool);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: active ? 'auto' : 'none',
        zIndex: 3,
        cursor: active ? 'crosshair' : 'default',
      }}
    />
  );
};
