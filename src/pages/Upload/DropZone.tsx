import { useRef } from 'react';
import type { FC } from 'react';
import { UploadIcon } from '@/components/Icon/icons';
import { tokens } from '@/theme';
import styles from './UploadPage.module.css';

interface DropZoneProps {
  onFiles: (files: File[]) => void;
}

export const DropZone: FC<DropZoneProps> = ({ onFiles }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) {
      onFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div
      className={styles.dropZone}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".dcm,.dicom,.svs,.ima,.img"
        multiple
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <div style={{ marginBottom: 12 }}>
        <UploadIcon color={tokens.textTer} />
      </div>
      <div className={styles.dropTitle}>Arrastra archivos DICOM aquí</div>
      <div className={styles.dropSub}>o haz click para seleccionar — acepta .dcm, .dicom y .svs</div>
    </div>
  );
};
