import { useState, useEffect, type FC } from 'react';
import { useSvsToolbar } from '../SvsToolbar/SvsToolbarContext';

const NICE_VALUES = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];

function formatLabel(microns: number): string {
  if (microns >= 1000) return `${microns / 1000} mm`;
  return `${microns} μm`;
}

export const Scalebar: FC = () => {
  const { state, viewerRef } = useSvsToolbar();
  const [bar, setBar] = useState<{ widthPx: number; label: string } | null>(null);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !state.mpp) return;

    const update = () => {
      const currentZoom = viewer.viewport.getZoom(true);
      const homeZoom = viewer.viewport.getHomeZoom();
      const imageZoom = currentZoom / homeZoom;
      const micronsPerPx = state.mpp! / imageZoom;

      // Pick a nice bar length between 80–200px
      let bestLength = NICE_VALUES[0]!;
      for (const val of NICE_VALUES) {
        const px = val / micronsPerPx;
        if (px >= 80 && px <= 200) {
          bestLength = val;
          break;
        }
        if (px < 200) bestLength = val;
      }

      setBar({
        widthPx: Math.round(bestLength! / micronsPerPx),
        label: formatLabel(bestLength!),
      });
    };

    viewer.addHandler('zoom', update);
    viewer.addHandler('open', update);
    update();

    return () => {
      viewer.removeHandler('zoom', update);
      viewer.removeHandler('open', update);
    };
  }, [viewerRef, state.mpp]);

  if (!bar) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        left: 16,
        zIndex: 5,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontFamily: 'monospace',
          color: '#fff',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
        }}
      >
        {bar.label}
      </span>
      <div
        style={{
          width: bar.widthPx,
          height: 3,
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.6)',
          borderRadius: 1,
        }}
      />
    </div>
  );
};
