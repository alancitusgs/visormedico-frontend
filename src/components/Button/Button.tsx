import type { FC, ReactNode, CSSProperties, MouseEventHandler } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  primary?: boolean;
  small?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export const Button: FC<ButtonProps> = ({
  children,
  primary,
  small,
  onClick,
  style,
  disabled,
  type = 'button',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`${styles.btn} ${primary ? styles.primary : styles.secondary} ${small ? styles.small : ''}`}
    style={style}
  >
    {children}
  </button>
);
