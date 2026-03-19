import { useState } from 'react';
import type { FC } from 'react';
import { Modal } from './Modal';
import formStyles from './ModalForm.module.css';
import styles from './UploadConsentModal.module.css';

interface Props {
  onAccept: () => void;
  onCancel: () => void;
}

export const UploadConsentModal: FC<Props> = ({ onAccept, onCancel }) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <Modal title="Aviso de responsabilidad y protección de datos" onClose={onCancel}>
      <div className={styles.body}>
        <p className={styles.intro}>
          Antes de subir imágenes a la plataforma, por favor lea y acepte las
          siguientes condiciones:
        </p>

        <ul className={styles.list}>
          <li>
            <strong>Datos personales:</strong> Declaro que las imágenes que voy
            a cargar <strong>no contienen datos personales identificables</strong> de
            pacientes (nombre, documento de identidad, fecha de nacimiento u
            otra información que permita identificar directa o indirectamente a
            una persona), o que dichos datos han sido debidamente anonimizados
            conforme a la normativa vigente de protección de datos personales
            (Ley N.° 29733 — Ley de Protección de Datos Personales del Perú y
            su reglamento).
          </li>
          <li>
            <strong>Consentimiento informado:</strong> En caso de que las
            imágenes provengan de estudios clínicos o diagnósticos, confirmo que
            cuento con el consentimiento informado del paciente o su
            representante legal para el uso académico y/o de investigación de
            dichas imágenes.
          </li>
          <li>
            <strong>Derechos de autor y propiedad intelectual:</strong> Declaro
            que soy el autor o titular legítimo de las imágenes, o que cuento
            con la autorización expresa del titular para cargarlas y utilizarlas
            en esta plataforma. Me comprometo a no subir material protegido por
            derechos de autor sin la debida autorización.
          </li>
          <li>
            <strong>Uso responsable:</strong> Me comprometo a utilizar la
            plataforma exclusivamente con fines académicos, de docencia o de
            investigación, y a no emplear las imágenes para fines comerciales no
            autorizados ni para cualquier actividad que vulnere la privacidad o
            dignidad de las personas.
          </li>
          <li>
            <strong>Responsabilidad del usuario:</strong> Asumo toda la
            responsabilidad por el contenido que cargue en la plataforma,
            eximiendo a la Universidad Peruana Cayetano Heredia de cualquier
            reclamación derivada del incumplimiento de estas condiciones.
          </li>
        </ul>

        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className={styles.checkbox}
          />
          He leído y acepto las condiciones anteriores.
        </label>
      </div>

      <div className={formStyles.actions}>
        <button className={formStyles.cancelBtn} onClick={onCancel}>
          Cancelar
        </button>
        <button
          className={formStyles.submitBtn}
          disabled={!accepted}
          onClick={onAccept}
        >
          Aceptar y continuar
        </button>
      </div>
    </Modal>
  );
};
