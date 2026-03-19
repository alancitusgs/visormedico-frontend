import { useEffect, useCallback } from 'react';
import type OpenSeadragon from 'openseadragon';

/**
 * Hook that listens for 'svs-screenshot' custom events (fired by the toolbar)
 * and captures the current OSD view + annotations as a PNG download.
 */
export function useScreenshot(
  viewerRef: React.RefObject<OpenSeadragon.Viewer | null>,
  annotationCanvasGetter?: () => HTMLCanvasElement | null,
) {
  const capture = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    // OSD v6: find the actual <canvas> element inside the viewer container
    const container = viewer.drawer?.canvas as HTMLElement | undefined;
    const osdCanvas =
      container instanceof HTMLCanvasElement
        ? container
        : container?.querySelector?.('canvas') ??
          (viewer.element as HTMLElement)?.querySelector?.('canvas');
    if (!osdCanvas) return;

    const offscreen = document.createElement('canvas');
    offscreen.width = osdCanvas.width;
    offscreen.height = osdCanvas.height;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    // Layer 1: OSD image
    try {
      ctx.drawImage(osdCanvas, 0, 0);
    } catch {
      // Canvas tainted — cannot capture
      return;
    }

    // Layer 2: Annotations (if available)
    const annCanvas = annotationCanvasGetter?.();
    if (annCanvas) {
      ctx.drawImage(annCanvas, 0, 0, offscreen.width, offscreen.height);
    }

    // Trigger download
    offscreen.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visumed-capture-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }, [viewerRef, annotationCanvasGetter]);

  useEffect(() => {
    const handler = () => capture();
    window.addEventListener('svs-screenshot', handler);
    return () => window.removeEventListener('svs-screenshot', handler);
  }, [capture]);
}
