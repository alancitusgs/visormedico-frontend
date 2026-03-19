import type { FC } from 'react';
import type { IconProps } from '@/components/Icon/icons';
import {
  SunIcon,
  ZoomInIcon,
  MaximizeIcon,
  RotateIcon,
  RulerIcon,
} from '@/components/Icon/icons';
import styles from './ViewerPage.module.css';

type ToolName = 'Wwwc' | 'Zoom' | 'Pan' | 'Rotate' | 'Length';

interface ViewerToolbarProps {
  activeTool: ToolName;
  onToolChange: (tool: ToolName) => void;
  onReset: () => void;
  onPreset?: (ww: number, wc: number) => void;
  onInvert?: () => void;
  inverted?: boolean;
}

const toolItems: { name: ToolName; Icon: FC<IconProps>; label: string }[] = [
  { name: 'Wwwc', Icon: SunIcon, label: 'Brillo/Contraste' },
  { name: 'Zoom', Icon: ZoomInIcon, label: 'Zoom' },
  { name: 'Pan', Icon: MaximizeIcon, label: 'Mover' },
  { name: 'Rotate', Icon: RotateIcon, label: 'Rotar' },
  { name: 'Length', Icon: RulerIcon, label: 'Medir' },
];

const PRESETS: { label: string; ww: number; wc: number }[] = [
  { label: 'Pulmón', ww: 1500, wc: -600 },
  { label: 'Hueso', ww: 2500, wc: 480 },
  { label: 'Cerebro', ww: 80, wc: 40 },
  { label: 'Tejido Blando', ww: 350, wc: 50 },
  { label: 'Abdomen', ww: 400, wc: 60 },
];

const InvertIcon: FC<IconProps> = ({ color = 'currentColor', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v18" />
    <path d="M12 3a9 9 0 0 1 0 18" fill={color} fillOpacity="0.3" />
  </svg>
);

export const ViewerToolbar: FC<ViewerToolbarProps> = ({
  activeTool,
  onToolChange,
  onReset,
  onPreset,
  onInvert,
  inverted,
}) => (
  <div className={styles.toolbar}>
    <div className={styles.toolbarInner}>
      {toolItems.map(({ name, Icon, label }) => (
        <button
          key={name}
          className={styles.toolBtn}
          style={{
            background: activeTool === name ? 'rgba(255,255,255,0.15)' : 'transparent',
          }}
          onClick={() => onToolChange(name)}
          title={label}
        >
          <Icon color={activeTool === name ? '#fff' : 'rgba(255,255,255,0.6)'} />
        </button>
      ))}

      {onInvert && (
        <>
          <div className={styles.toolDivider} />
          <button
            className={styles.toolBtn}
            style={{
              background: inverted ? 'rgba(255,255,255,0.15)' : 'transparent',
            }}
            onClick={onInvert}
            title="Invertir"
          >
            <InvertIcon color={inverted ? '#fff' : 'rgba(255,255,255,0.6)'} />
          </button>
        </>
      )}

      {onPreset && (
        <>
          <div className={styles.toolDivider} />
          <select
            className={styles.windowSelect}
            defaultValue=""
            onChange={(e) => {
              const idx = Number(e.target.value);
              if (!isNaN(idx) && PRESETS[idx]) {
                onPreset(PRESETS[idx].ww, PRESETS[idx].wc);
              }
              e.target.value = '';
            }}
          >
            <option value="" disabled>Presets</option>
            {PRESETS.map((p, i) => (
              <option key={p.label} value={i}>
                {p.label} (WW:{p.ww} WC:{p.wc})
              </option>
            ))}
          </select>
        </>
      )}

      <div className={styles.toolDivider} />
      <button
        className={styles.toolBtn}
        onClick={onReset}
        title="Restaurar vista"
        style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', width: 'auto', padding: '0 8px' }}
      >
        Reset
      </button>
    </div>
  </div>
);
