import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import type { VisitsPerDay } from '@/types';
import { tokens } from '@/theme';

interface VisitsChartProps {
  data: VisitsPerDay[];
}

interface HoverState {
  index: number;
  cx: number;
  top: number;
}

const MARGIN = { top: 12, right: 8, bottom: 24, left: 36 };
const HEIGHT = 240;

/** Paso "limpio" (1, 2, 5 × 10^k) para que los ticks del eje Y sean números redondos. */
function niceStep(raw: number): number {
  if (raw <= 1) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const m of [1, 2, 5, 10]) {
    if (raw <= m * pow) return m * pow;
  }
  return 10 * pow;
}

function parseDay(iso: string): Date {
  const [y = 1970, m = 1, d = 1] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDay(iso: string): string {
  return parseDay(iso).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
}

export const VisitsChart: FC<VisitsChartProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [hover, setHover] = useState<HoverState | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const n = data.length;
  const innerW = Math.max(width - MARGIN.left - MARGIN.right, 0);
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;

  const maxCount = Math.max(...data.map((d) => d.count), 0);
  const step = niceStep(Math.ceil(Math.max(maxCount, 4) / 4));
  const yMax = step * 4;
  const yTicks = [0, step, step * 2, step * 3, step * 4];

  const slot = n > 0 ? innerW / n : 0;
  const barW = Math.max(Math.min(24, slot - 2), 1.5);
  const peakIndex = maxCount > 0 ? data.findIndex((d) => d.count === maxCount) : -1;

  // Etiquetas del eje X espaciadas (~6 visibles)
  const labelEvery = Math.max(1, Math.ceil(n / 6));

  const yFor = (count: number) => MARGIN.top + innerH - (count / yMax) * innerH;
  const xFor = (i: number) => MARGIN.left + i * slot + slot / 2;

  const barPath = (i: number, count: number) => {
    const x = xFor(i) - barW / 2;
    const y = yFor(count);
    const h = MARGIN.top + innerH - y;
    const r = Math.min(4, barW / 2, h);
    // Extremo superior redondeado (4px), base cuadrada sobre la línea cero
    return [
      `M ${x} ${MARGIN.top + innerH}`,
      `L ${x} ${y + r}`,
      `Q ${x} ${y} ${x + r} ${y}`,
      `L ${x + barW - r} ${y}`,
      `Q ${x + barW} ${y} ${x + barW} ${y + r}`,
      `L ${x + barW} ${MARGIN.top + innerH}`,
      'Z',
    ].join(' ');
  };

  const hovered = hover ? data[hover.index] : null;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <svg
        width={width}
        height={HEIGHT}
        role="img"
        aria-label="Visitas por día"
        onMouseLeave={() => setHover(null)}
      >
        {/* Gridlines: hairline sólidas, un paso sobre la superficie */}
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={MARGIN.left}
              x2={width - MARGIN.right}
              y1={yFor(t)}
              y2={yFor(t)}
              stroke={tokens.border}
              strokeWidth={1}
            />
            <text
              x={MARGIN.left - 8}
              y={yFor(t) + 3.5}
              textAnchor="end"
              fontSize={10}
              fill={tokens.textTer}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {t.toLocaleString('es-PE')}
            </text>
          </g>
        ))}

        {/* Barras */}
        {data.map((d, i) => (
          <path
            key={d.date}
            d={barPath(i, d.count)}
            fill={tokens.accent}
            opacity={hover && hover.index !== i ? 0.45 : 1}
            style={{ transition: 'opacity 0.1s ease' }}
          />
        ))}

        {/* Etiqueta directa solo en el pico (el extremo), en token de texto */}
        {peakIndex >= 0 && (!hover || hover.index === peakIndex) && (
          <text
            x={xFor(peakIndex)}
            y={yFor(maxCount) - 6}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            fill={tokens.text}
          >
            {maxCount.toLocaleString('es-PE')}
          </text>
        )}

        {/* Etiquetas del eje X */}
        {data.map((d, i) =>
          i % labelEvery === 0 ? (
            <text
              key={`x-${d.date}`}
              x={xFor(i)}
              y={HEIGHT - 6}
              textAnchor="middle"
              fontSize={10}
              fill={tokens.textTer}
            >
              {formatDay(d.date)}
            </text>
          ) : null,
        )}

        {/* Zonas de hover/focus: toda la columna, más grande que la marca */}
        {data.map((d, i) => (
          <rect
            key={`hit-${d.date}`}
            x={MARGIN.left + i * slot}
            y={MARGIN.top}
            width={slot}
            height={innerH}
            fill="transparent"
            tabIndex={0}
            aria-label={`${formatDay(d.date)}: ${d.count} visitas`}
            style={{ outline: 'none' }}
            onMouseEnter={() => setHover({ index: i, cx: xFor(i), top: yFor(d.count) })}
            onFocus={() => setHover({ index: i, cx: xFor(i), top: yFor(d.count) })}
            onBlur={() => setHover(null)}
          />
        ))}
      </svg>

      {/* Tooltip: el valor manda, la fecha acompaña */}
      {hover && hovered && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(Math.max(hover.cx - 50, 0), width - 110),
            top: Math.max(hover.top - 56, 0),
            pointerEvents: 'none',
            background: tokens.card,
            border: `1px solid ${tokens.border}`,
            borderRadius: 6,
            boxShadow: tokens.shadow,
            padding: '6px 10px',
            minWidth: 100,
            zIndex: 5,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: tokens.text, lineHeight: 1.2 }}>
            {hovered.count.toLocaleString('es-PE')}{' '}
            <span style={{ fontSize: 11, fontWeight: 400, color: tokens.textSec }}>
              {hovered.count === 1 ? 'visita' : 'visitas'}
            </span>
          </div>
          <div style={{ fontSize: 11, color: tokens.textTer, marginTop: 1 }}>
            {parseDay(hovered.date).toLocaleDateString('es-PE', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </div>
        </div>
      )}
    </div>
  );
};
