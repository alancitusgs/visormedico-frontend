import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IconProps } from '@/components/Icon/icons';
import { Card } from '@/components';
import { tokens } from '@/theme';
import { UploadIcon, CodeIcon, GlobeIcon } from '@/components/Icon/icons';

interface QuickAction {
  icon: FC<IconProps>;
  label: string;
  color: string;
  path: string;
}

const actions: QuickAction[] = [
  { icon: UploadIcon, label: 'Subir imágenes', color: tokens.accent, path: '/upload' },
  { icon: CodeIcon, label: 'Publicar visor', color: tokens.purple, path: '/embeds' },
  { icon: GlobeIcon, label: 'Gestionar CORS', color: tokens.cyan, path: '/cors' },
  // { icon: FolderIcon, label: 'Nueva colección', color: tokens.blue, path: '/collections' },
];

export const QuickActions: FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>
        Accesos Rápidos
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {actions.map((b) => (
          <button
            key={b.path}
            onClick={() => navigate(b.path)}
            style={{
              padding: '16px 10px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--color-border)',
              background: `${b.color}06`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
          >
            <b.icon color={b.color} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-sec)' }}>
              {b.label}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
};
