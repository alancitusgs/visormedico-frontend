import type { FC, ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export const Modal: FC<ModalProps> = ({ title, children, onClose }) => (
  <div className={styles.overlay} onClick={onClose}>
    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modalTitle}>{title}</div>
      {children}
    </div>
  </div>
);
