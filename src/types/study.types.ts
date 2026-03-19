export type Modality = 'CT' | 'MR' | 'CR' | 'US' | 'DX';

export interface Study {
  id: number;
  filename: string;
  original_name: string;
  file_size: number | null;
  patient_name: string | null;
  patient_id: string | null;
  study_date: string | null;
  modality: Modality | null;
  uploaded_at: string;
  share_token: string | null;
}

export interface StudyWithUrls extends Study {
  url: string | null;
  wadouri: string | null;
  dzi_path: string | null;
  file_type: 'dicom' | 'svs';
}

export interface SlideProperties {
  width: number;
  height: number;
  mpp_x: number | null;
  mpp_y: number | null;
  mpp: number | null;
  objective_power: number | null;
  vendor: string | null;
}
