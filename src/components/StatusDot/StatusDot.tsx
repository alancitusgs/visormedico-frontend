import type { FC } from 'react';
import type { CorsStatus, EmbedStatus } from '@/types';
import { tokens } from '@/theme';
import styles from './StatusDot.module.css';

type Status = CorsStatus | EmbedStatus;

interface StatusDotProps {
  status: Status;
}

const statusColors: Record<Status, string> = {
  active: tokens.green,
  expired: tokens.red,
  dev: tokens.amber,
};

const statusLabels: Record<Status, string> = {
  active: 'Activo',
  expired: 'Expirado',
  dev: 'Dev',
};

export const StatusDot: FC<StatusDotProps> = ({ status }) => {
  const color = statusColors[status];
  const label = statusLabels[status];

  return (
    <span className={styles.wrapper} style={{ color }}>
      <span className={styles.dot} style={{ background: color }} />
      {label}
    </span>
  );
};
