import type { FC } from 'react';
import type { IconProps } from '@/components/Icon/icons';
import {
  HandIcon,
  ZoomInIcon,
  ZoomOutIcon,
  HomeViewIcon,
  RotateIcon,
  PencilIcon,
  RectangleIcon,
  PolygonIcon,
  LineIcon,
  RulerIcon,
  TrashIcon,
  MagnifierIcon,
  CameraIcon,
} from '@/components/Icon/icons';

export type SvsToolName =
  | 'pan'
  | 'zoomIn'
  | 'zoomOut'
  | 'home'
  | 'rotate'
  | 'freehand'
  | 'rectangle'
  | 'polygon'
  | 'line'
  | 'ruler'
  | 'clearAnnotations'
  | 'magnifier'
  | 'screenshot';

export type ToolGroup = 'navigation' | 'annotation' | 'measurement' | 'widgets';

export interface ToolDef {
  name: SvsToolName;
  Icon: FC<IconProps>;
  label: string;
  group: ToolGroup;
  isToggle: boolean;
}

export const DRAWING_TOOLS: SvsToolName[] = [
  'freehand',
  'rectangle',
  'polygon',
  'line',
  'ruler',
];

export function isDrawingTool(tool: SvsToolName): boolean {
  return DRAWING_TOOLS.includes(tool);
}

export const toolDefs: ToolDef[] = [
  // Navigation
  { name: 'pan', Icon: HandIcon, label: 'Mover', group: 'navigation', isToggle: true },
  { name: 'zoomIn', Icon: ZoomInIcon, label: 'Acercar', group: 'navigation', isToggle: false },
  { name: 'zoomOut', Icon: ZoomOutIcon, label: 'Alejar', group: 'navigation', isToggle: false },
  { name: 'home', Icon: HomeViewIcon, label: 'Vista inicial', group: 'navigation', isToggle: false },
  { name: 'rotate', Icon: RotateIcon, label: 'Girar 90°', group: 'navigation', isToggle: false },
  // Annotation
  { name: 'freehand', Icon: PencilIcon, label: 'Dibujo libre', group: 'annotation', isToggle: true },
  { name: 'rectangle', Icon: RectangleIcon, label: 'Rectángulo', group: 'annotation', isToggle: true },
  { name: 'polygon', Icon: PolygonIcon, label: 'Polígono', group: 'annotation', isToggle: true },
  { name: 'line', Icon: LineIcon, label: 'Línea', group: 'annotation', isToggle: true },
  { name: 'clearAnnotations', Icon: TrashIcon, label: 'Limpiar anotaciones', group: 'annotation', isToggle: false },
  // Measurement
  { name: 'ruler', Icon: RulerIcon, label: 'Medir distancia', group: 'measurement', isToggle: true },
  // Widgets
  { name: 'magnifier', Icon: MagnifierIcon, label: 'Lupa', group: 'widgets', isToggle: true },
  { name: 'screenshot', Icon: CameraIcon, label: 'Capturar pantalla', group: 'widgets', isToggle: false },
];

export const TOOL_GROUPS: ToolGroup[] = ['navigation', 'annotation', 'measurement', 'widgets'];
