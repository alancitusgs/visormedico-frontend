export interface Point {
  x: number;
  y: number;
}

export type AnnotationType = 'freehand' | 'rectangle' | 'polygon' | 'line' | 'ruler';

export interface Annotation {
  id: string;
  type: AnnotationType;
  points: Point[];
  color: string;
  strokeWidth: number;
  label?: string;
}

export interface DrawingState {
  type: AnnotationType;
  points: Point[];
}

export interface DrawStyle {
  color: string;
  strokeWidth: number;
}
