import { Fragment } from 'react';
import type { FC } from 'react';
import { Card, ModalityBadge } from '@/components';
import { CheckIcon } from '@/components/Icon/icons';
import { tokens } from '@/theme';
import type { UploadFileItem } from './UploadPage';

interface FileListProps {
  files: UploadFileItem[];
  onDisplayNameChange?: (index: number, value: string) => void;
}

const statusLabel: Record<UploadFileItem['status'], { text: string; color: string }> = {
  pending: { text: 'Pendiente', color: tokens.textTer },
  uploading: { text: 'Subiendo...', color: tokens.blue },
  done: { text: 'Listo', color: tokens.green },
  error: { text: 'Error', color: tokens.accent },
};

export const FileList: FC<FileListProps> = ({ files, onDisplayNameChange }) => {
  if (files.length === 0) return null;

  return (
    <Card>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: 12 }}>
        Archivos ({files.length})
      </div>
      {files.map((f, i) => {
        const st = statusLabel[f.status];
        return (
          <Fragment key={i}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 0',
                borderBottom: f.status !== 'uploading' ? `1px solid var(--color-border-light)` : 'none',
              }}
            >
              <ModalityBadge modality={f.modality} />
              <span style={{ flex: 1, fontSize: '13px', color: 'var(--color-text)' }}>{f.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-ter)' }}>{f.size}</span>
              <span
                style={{
                  fontSize: '11px',
                  color: st.color,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  minWidth: 80,
                  justifyContent: 'flex-end',
                }}
              >
                {f.status === 'done' && <CheckIcon color={tokens.green} size={12} />}
                {f.status === 'uploading' ? `${f.progress}%` : st.text}
              </span>
            </div>
            {f.status === 'pending' && onDisplayNameChange && (
              <div style={{ padding: '4px 0 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-sec)', whiteSpace: 'nowrap' }}>
                  Nombre:
                </label>
                <input
                  type="text"
                  placeholder={f.name}
                  value={f.displayName}
                  onChange={(e) => onDisplayNameChange(i, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '5px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '12px',
                    color: 'var(--color-text)',
                    fontFamily: 'inherit',
                    background: '#fff',
                  }}
                />
              </div>
            )}
            {f.status === 'uploading' && (
              <div
                style={{
                  height: 3,
                  background: 'var(--color-border-light)',
                  borderRadius: 2,
                  marginBottom: 4,
                  borderBottom: `1px solid var(--color-border-light)`,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${f.progress}%`,
                    background: tokens.blue,
                    borderRadius: 2,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            )}
          </Fragment>
        );
      })}
    </Card>
  );
};
