import type { FC, ReactNode } from 'react';
import styles from './Tag.module.css';

interface TagProps {
  children: ReactNode;
}

export const Tag: FC<TagProps> = ({ children }) => (
  <span className={styles.tag}>{children}</span>
);
