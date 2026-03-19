import { useState, useRef, useCallback } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Modality } from '@/types';
import { Card, Button } from '@/components';
import { UploadConsentModal } from '@/components/Modal/UploadConsentModal';
import { studiesService } from '@/services/studies.service';
import { DropZone } from './DropZone';
import { FileList } from './FileList';
import { AssignmentForm } from './AssignmentForm';
import styles from './UploadPage.module.css';

export interface UploadFileItem {
  file: File;
  name: string;
  displayName: string;
  size: string;
  modality: Modality;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function guessModality(name: string): Modality {
  const lower = name.toLowerCase();
  if (lower.includes('ct') || lower.includes('tac')) return 'CT';
  if (lower.includes('mr') || lower.includes('rm')) return 'MR';
  if (lower.includes('us') || lower.includes('eco')) return 'US';
  if (lower.includes('dx')) return 'DX';
  return 'CR';
}

export const UploadPage: FC = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadFileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [courseId, setCourseId] = useState<number | ''>('');
  const pendingFilesRef = useRef<File[]>([]);

  const addFiles = useCallback((selectedFiles: File[]) => {
    const newItems: UploadFileItem[] = selectedFiles.map((f) => ({
      file: f,
      name: f.name,
      displayName: '',
      size: formatSize(f.size),
      modality: guessModality(f.name),
      status: 'pending',
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newItems]);
  }, []);

  const handleFiles = (selectedFiles: File[]) => {
    if (consentAccepted) {
      addFiles(selectedFiles);
      return;
    }
    pendingFilesRef.current = selectedFiles;
    setShowConsent(true);
  };

  const handleConsentAccept = () => {
    setConsentAccepted(true);
    setShowConsent(false);
    addFiles(pendingFilesRef.current);
    pendingFilesRef.current = [];
  };

  const handleConsentCancel = () => {
    setShowConsent(false);
    pendingFilesRef.current = [];
  };

  const updateDisplayName = (index: number, value: string) => {
    setFiles((prev) =>
      prev.map((f, idx) => (idx === index ? { ...f, displayName: value } : f)),
    );
  };

  const handleUpload = async () => {
    if (files.length === 0 || uploading || !courseId) return;
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const currentFile = files[i];
      if (!currentFile || currentFile.status === 'done') continue;

      setFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: 'uploading' } : f)),
      );

      try {
        const formData = new FormData();
        formData.append('dicomFile', currentFile.file);
        if (currentFile.displayName.trim()) {
          formData.append('displayName', currentFile.displayName.trim());
        }
        if (courseId) {
          formData.append('courseId', String(courseId));
        }
        await studiesService.uploadDicom(formData, (percent) => {
          setFiles((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, progress: percent } : f)),
          );
        });
        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: 'done', progress: 100 } : f)),
        );
      } catch {
        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: 'error' } : f)),
        );
      }
    }

    setUploading(false);
    setTimeout(() => navigate('/library'), 1500);
  };

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);
  const doneCount = files.filter((f) => f.status === 'done').length;

  return (
    <div className={styles.page}>
      {showConsent && (
        <UploadConsentModal
          onAccept={handleConsentAccept}
          onCancel={handleConsentCancel}
        />
      )}
      <div>
        <DropZone onFiles={handleFiles} />
        <FileList files={files} onDisplayNameChange={updateDisplayName} />
      </div>
      <div>
        <Card>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: 16 }}>
            Resumen de carga
          </div>
          {[
            ['Archivos', files.length || '—'],
            ['Peso total', files.length ? formatSize(totalSize) : '—'],
            ['Subidos', files.length ? `${doneCount}/${files.length}` : '—'],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 8 }}
            >
              <span style={{ color: 'var(--color-text-ter)' }}>{k}</span>
              <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{v}</span>
            </div>
          ))}
          {!courseId && files.length > 0 && (
            <div style={{ fontSize: '11px', color: '#e25950', marginTop: 8 }}>
              Selecciona una asignatura antes de subir
            </div>
          )}
          <Button
            primary
            style={{ width: '100%', marginTop: 16, justifyContent: 'center', opacity: files.length && !uploading && courseId ? 1 : 0.4 }}
            disabled={files.length === 0 || uploading || !courseId}
            onClick={handleUpload}
          >
            {uploading ? 'Subiendo...' : 'Confirmar y Subir'}
          </Button>
        </Card>
        <AssignmentForm onAssignment={(id) => { setCourseId(id || ''); }} />
      </div>
    </div>
  );
};
