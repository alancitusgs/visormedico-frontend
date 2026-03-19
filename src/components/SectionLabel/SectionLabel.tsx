import type { FC, ReactNode } from 'react';
import styles from './SectionLabel.module.css';

interface SectionLabelProps {
  children: ReactNode;
}

export const SectionLabel: FC<SectionLabelProps> = ({ children }) => (
  <div className={styles.label}>{children}</div>
);
