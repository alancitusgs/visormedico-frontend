import type { FC, ReactNode, CSSProperties } from 'react';
import styles from './Card.module.css';

export interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  noPad?: boolean;
  onClick?: () => void;
}

export const Card: FC<CardProps> = ({ children, style, noPad, onClick }) => (
  <div
    className={`${styles.card} ${noPad ? styles.noPad : ''}`}
    style={style}
    onClick={onClick}
  >
    {children}
  </div>
);
