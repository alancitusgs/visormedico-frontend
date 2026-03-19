import { useCallback, type FC } from 'react';
import { useSvsToolbar } from './SvsToolbarContext';
import { toolDefs, TOOL_GROUPS, type SvsToolName } from './tools';
import { ZoomSlider } from '../SvsWidgets/ZoomSlider';
import styles from './SvsToolbar.module.css';

interface SvsToolbarProps {
  onClearAnnotations?: () => void;
}

export const SvsToolbar: FC<SvsToolbarProps> = ({ onClearAnnotations }) => {
  const { state, dispatch, viewerRef } = useSvsToolbar();

  const handleClick = useCallback(
    (tool: SvsToolName) => {
      const viewer = viewerRef.current;
      if (!viewer) return;

      switch (tool) {
        case 'zoomIn':
          viewer.viewport.zoomBy(1.5);
          return;
        case 'zoomOut':
          viewer.viewport.zoomBy(0.67);
          return;
        case 'home':
          viewer.viewport.goHome();
          return;
        case 'rotate':
          viewer.viewport.setRotation(
            (viewer.viewport.getRotation() + 90) % 360,
          );
          return;
        case 'clearAnnotations':
          if (onClearAnnotations) {
            onClearAnnotations();
          } else {
            dispatch({ type: 'CLEAR_ANNOTATIONS' });
          }
          return;
        case 'screenshot':
          window.dispatchEvent(new CustomEvent('svs-screenshot'));
          return;
        case 'magnifier':
          dispatch({ type: 'TOGGLE_MAGNIFIER' });
          return;
        default:
          dispatch({ type: 'SET_TOOL', tool });
      }
    },
    [dispatch, viewerRef],
  );

  return (
    <div className={styles.toolbar}>
      <div className={styles.logo}>
        <img
          src="https://develop-core-upch-psilva.d1axekf15a9bbd.amplifyapp.com/assets/logo-icon.DC7S9UPC.png"
          alt="UPCH"
          className={styles.logoImg}
        />
      </div>
      <div className={styles.divider} />
      {TOOL_GROUPS.map((group, gi) => {
        const tools = toolDefs.filter((t) => t.group === group);
        if (tools.length === 0) return null;

        return (
          <div key={group}>
            {gi > 0 && <div className={styles.divider} />}
            <div className={styles.group}>
              {tools.map(({ name, Icon, label, isToggle }) => {
                const isActive =
                  (isToggle && state.activeTool === name) ||
                  (name === 'magnifier' && state.magnifierEnabled);

                return (
                  <button
                    key={name}
                    className={`${styles.btn} ${isActive ? styles.btnActive : ''}`}
                    onClick={() => handleClick(name)}
                    title={label}
                  >
                    <Icon
                      size={16}
                      color={isActive ? '#fff' : 'rgba(255,255,255,0.6)'}
                    />
                    <span className={styles.tooltip}>{label}</span>
                  </button>
                );
              })}
              {group === 'navigation' && <ZoomSlider />}
            </div>
          </div>
        );
      })}
    </div>
  );
};
