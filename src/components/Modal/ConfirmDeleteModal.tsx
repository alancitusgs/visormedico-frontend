import { useState } from 'react';
import type { FC } from 'react';
import { Modal } from './Modal';
import styles from './ModalForm.module.css';

interface Props {
  title: string;
  message: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const ConfirmDeleteModal: FC<Props> = ({ title, message, onConfirm, onClose }) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal title={title} onClose={deleting ? () => {} : onClose}>
      <p className={styles.confirmText}>{message}</p>
      <div className={styles.actions}>
        <button className={styles.cancelBtn} onClick={onClose} disabled={deleting}>
          Cancelar
        </button>
        <button className={styles.deleteBtn} onClick={handleConfirm} disabled={deleting}>
          {deleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </Modal>
  );
};
