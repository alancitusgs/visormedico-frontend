export interface Period {
  id: number;
  name: string;
  course_count: number;
}

export interface Course {
  id: number;
  name: string;
  semester: string;
  period_id: number | null;
  period_name: string | null;
  images: number;
  collections: number;
  embeds: number;
  color: string;
}

export interface Collection {
  id: number;
  name: string;
  course: string | null;
  course_id: number | null;
  studyCount: number;
}

export interface CollectionImage {
  id: number;
  filename: string;
  original_name: string;
  patient_name: string | null;
  modality: string | null;
  study_date: string | null;
  file_size: number | null;
}

export interface CourseDetail extends Course {
  collection_list: Collection[];
}

export interface CollectionDetail extends Collection {
  images: CollectionImage[];
}
