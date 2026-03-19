import type { DrawStyle } from './types';

interface Pt {
  x: number;
  y: number;
}

function applyStyle(ctx: CanvasRenderingContext2D, style: DrawStyle) {
  ctx.strokeStyle = style.color;
  ctx.lineWidth = style.strokeWidth;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

export function drawFreehand(ctx: CanvasRenderingContext2D, points: Pt[], style: DrawStyle): void {
  if (points.length < 2) return;
  applyStyle(ctx, style);
  ctx.beginPath();
  const first = points[0]!;
  ctx.moveTo(first.x, first.y);
  for (let i = 1; i < points.length; i++) {
    const p = points[i]!;
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
}

export function drawRectangle(ctx: CanvasRenderingContext2D, p1: Pt, p2: Pt, style: DrawStyle): void {
  applyStyle(ctx, style);
  const x = Math.min(p1.x, p2.x);
  const y = Math.min(p1.y, p2.y);
  const w = Math.abs(p2.x - p1.x);
  const h = Math.abs(p2.y - p1.y);
  ctx.strokeRect(x, y, w, h);
}

export function drawPolygon(ctx: CanvasRenderingContext2D, points: Pt[], closed: boolean, style: DrawStyle): void {
  if (points.length < 2) return;
  applyStyle(ctx, style);
  ctx.beginPath();
  const first = points[0]!;
  ctx.moveTo(first.x, first.y);
  for (let i = 1; i < points.length; i++) {
    const p = points[i]!;
    ctx.lineTo(p.x, p.y);
  }
  if (closed) {
    ctx.closePath();
    ctx.fillStyle = style.color.replace(')', ', 0.1)').replace('rgb(', 'rgba(');
    // Simple semi-transparent fill for closed polygons
    ctx.globalAlpha = 0.15;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.stroke();
}

export function drawLine(ctx: CanvasRenderingContext2D, p1: Pt, p2: Pt, style: DrawStyle): void {
  applyStyle(ctx, style);
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();

  // Draw endpoint dots
  const dotR = style.strokeWidth + 1;
  ctx.fillStyle = style.color;
  ctx.beginPath();
  ctx.arc(p1.x, p1.y, dotR, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(p2.x, p2.y, dotR, 0, Math.PI * 2);
  ctx.fill();
}

export function drawRuler(
  ctx: CanvasRenderingContext2D,
  p1: Pt,
  p2: Pt,
  label: string,
  style: DrawStyle,
): void {
  applyStyle(ctx, style);

  // Main line
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();

  // Perpendicular tick marks at endpoints
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return;

  const tickLen = 8;
  const nx = (-dy / len) * tickLen;
  const ny = (dx / len) * tickLen;

  ctx.beginPath();
  ctx.moveTo(p1.x + nx, p1.y + ny);
  ctx.lineTo(p1.x - nx, p1.y - ny);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(p2.x + nx, p2.y + ny);
  ctx.lineTo(p2.x - nx, p2.y - ny);
  ctx.stroke();

  // Label background + text
  if (label) {
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    ctx.font = '12px monospace';
    const metrics = ctx.measureText(label);
    const pad = 4;
    const bgW = metrics.width + pad * 2;
    const bgH = 16 + pad;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(midX - bgW / 2, midY - bgH - 4, bgW, bgH);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, midX, midY - 4);
  }
}

export function formatDistance(distMicrons: number): string {
  if (distMicrons >= 1000) {
    return `${(distMicrons / 1000).toFixed(2)} mm`;
  }
  return `${distMicrons.toFixed(1)} μm`;
}
