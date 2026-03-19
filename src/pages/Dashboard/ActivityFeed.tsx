import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { IconProps } from '@/components/Icon/icons';
import type { ActivityItem } from '@/types';
import { Card } from '@/components';
import { tokens } from '@/theme';
import { statsService } from '@/services/stats.service';
import {
  ImagesIcon,
  CodeIcon,
  GlobeIcon,
  FolderIcon,
  BookIcon,
} from '@/components/Icon/icons';

const iconMap: Record<string, { icon: FC<IconProps>; color: string }> = {
  image: { icon: ImagesIcon, color: tokens.accent },
  embed: { icon: CodeIcon, color: tokens.purple },
  cors: { icon: GlobeIcon, color: tokens.cyan },
  collection: { icon: FolderIcon, color: tokens.amber },
  course: { icon: BookIcon, color: tokens.blue },
};

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return 'justo ahora';
  if (diffMin < 60) return `hace ${diffMin}m`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'ayer';
  if (diffDays < 30) return `hace ${diffDays}d`;
  return new Date(dateStr).toLocaleDateString('es-PE');
}

export const ActivityFeed: FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsService
      .getRecentActivity()
      .then(setActivities)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>
        Actividad Reciente
      </div>
      {loading ? (
        <div style={{ fontSize: '13px', color: 'var(--color-text-ter)', padding: '16px 0' }}>
          Cargando actividad...
        </div>
      ) : activities.length === 0 ? (
        <div style={{ fontSize: '13px', color: 'var(--color-text-ter)', padding: '16px 0' }}>
          No hay actividad reciente
        </div>
      ) : (
        activities.map((a, i) => {
          const mapping = (iconMap[a.type] ?? iconMap.image)!;
          const Icon = mapping.icon;
          const color = mapping.color;

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '10px 0',
                borderBottom: i < activities.length - 1 ? '1px solid var(--color-border-light)' : 'none',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: `${color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon color={color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: 'var(--color-text)' }}>{a.text}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-ter)', marginTop: 2 }}>
                  {formatRelativeTime(a.timestamp)}
                </div>
              </div>
            </div>
          );
        })
      )}
    </Card>
  );
};
