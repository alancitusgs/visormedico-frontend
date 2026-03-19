import type { FC } from 'react';
import type { Modality } from '@/types';
import { tokens } from '@/theme';
import styles from './ModalityBadge.module.css';

interface ModalityBadgeProps {
  modality: Modality;
}

const modalityColors: Record<Modality, string> = {
  CT: tokens.accent,
  MR: tokens.purple,
  CR: tokens.green,
  US: tokens.cyan,
  DX: tokens.amber,
};

export const ModalityBadge: FC<ModalityBadgeProps> = ({ modality }) => {
  const color = modalityColors[modality];

  return (
    <span
      className={styles.badge}
      style={{
        background: `${color}16`,
        color,
        borderColor: `${color}30`,
      }}
    >
      {modality}
    </span>
  );
};
