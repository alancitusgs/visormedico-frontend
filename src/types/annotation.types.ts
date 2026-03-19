export interface AnnotationPoint {
  x: number;
  y: number;
}

export interface AnnotationData {
  id: number;
  type: string;
  points: AnnotationPoint[];
  color: string;
  stroke_width: number;
  label: string | null;
  created_at: string;
}
