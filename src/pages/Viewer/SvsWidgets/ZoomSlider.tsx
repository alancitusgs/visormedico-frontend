import { useCallback, type FC } from 'react';
import { useSvsToolbar } from '../SvsToolbar/SvsToolbarContext';
import styles from '../SvsToolbar/SvsToolbar.module.css';

export const ZoomSlider: FC = () => {
  const { state, viewerRef } = useSvsToolbar();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const viewer = viewerRef.current;
      if (!viewer) return;
      const pct = Number(e.target.value);
      const homeZoom = viewer.viewport.getHomeZoom();
      viewer.viewport.zoomTo((pct / 100) * homeZoom);
    },
    [viewerRef],
  );

  return (
    <div className={styles.sliderWrap}>
      <input
        type="range"
        className={styles.slider}
        min={10}
        max={4000}
        value={state.zoomLevel}
        onChange={handleChange}
        title={`Zoom: ${state.zoomLevel}%`}
      />
      <span className={styles.zoomLabel}>{state.zoomLevel}%</span>
    </div>
  );
};
