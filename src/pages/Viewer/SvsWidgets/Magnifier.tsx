import { useRef, useEffect, useCallback, useState, type FC } from 'react';
import { useSvsToolbar } from '../SvsToolbar/SvsToolbarContext';

const MAG_SIZE = 180;
const MAG_SCALE = 2;

export const Magnifier: FC = () => {
  const { viewerRef } = useSvsToolbar();
  const magCanvasRef = useRef<HTMLCanvasElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const viewer = viewerRef.current;
    const magCanvas = magCanvasRef.current;
    if (!viewer || !magCanvas || !pos) return;

    const osdCanvas = (viewer.drawer as { canvas?: HTMLCanvasElement }).canvas;
    if (!osdCanvas) return;

    const dpr = window.devicePixelRatio || 1;
    const size = MAG_SIZE * dpr;
    if (magCanvas.width !== size) {
      magCanvas.width = size;
      magCanvas.height = size;
    }

    const ctx = magCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    // Save and clip to circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    // Draw magnified region from OSD canvas
    const srcX = pos.x * dpr - (size / MAG_SCALE) / 2;
    const srcY = pos.y * dpr - (size / MAG_SCALE) / 2;
    const srcSize = size / MAG_SCALE;

    ctx.drawImage(
      osdCanvas,
      srcX,
      srcY,
      srcSize,
      srcSize,
      0,
      0,
      size,
      size,
    );

    ctx.restore();

    // Crosshair
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.stroke();
  }, [viewerRef, pos]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const container = viewer.container as HTMLElement;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const onLeave = () => setPos(null);

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, [viewerRef]);

  // Redraw on position change + viewport updates
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const handler = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    };
    viewer.addHandler('update-viewport', handler);
    return () => {
      viewer.removeHandler('update-viewport', handler);
    };
  }, [viewerRef, draw]);

  if (!pos) return null;

  return (
    <canvas
      ref={magCanvasRef}
      style={{
        position: 'absolute',
        left: pos.x - MAG_SIZE / 2,
        top: pos.y - MAG_SIZE / 2,
        width: MAG_SIZE,
        height: MAG_SIZE,
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.5)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
        pointerEvents: 'none',
        zIndex: 8,
      }}
    />
  );
};
