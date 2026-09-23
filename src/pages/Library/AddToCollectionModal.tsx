import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Collection, Study } from '@/types';
import { tokens } from '@/theme';
import { Modal } from '@/components';
import { FolderIcon } from '@/components/Icon/icons';
import { collectionsService } from '@/services/collections.service';
import formStyles from '@/components/Modal/ModalForm.module.css';
import styles from './LibraryPage.module.css';

interface Props {
  study: Study;
  onDone: (collectionName: string) => void;
  onClose: () => void;
}

export const AddToCollectionModal: FC<Props> = ({ study, onDone, onClose }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    collectionsService.getCollections()
      .then(setCollections)
      .catch(() => setError('No se pudieron cargar las colecciones.'))
      .finally(() => setLoading(false));
  }, []);

  const creating = newName.trim().length > 0;
  const canSubmit = !saving && (creating || selectedId !== null);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    setError('');
    try {
      let target: Collection;
      if (creating) {
        target = await collectionsService.createCollection({ name: newName.trim(), course_id: null });
      } else {
        target = collections.find((c) => c.id === selectedId)!;
      }
      await collectionsService.addImages(target.id, [study.id]);
      onDone(target.name);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al agregar a la colección.');
      setSaving(false);
    }
  };

  return (
    <Modal title="Agregar a colección" onClose={onClose}>
      <p className={styles.addModalSubtitle}>
        {study.display_name || study.original_name}
      </p>

      {loading ? (
        <p className={styles.addModalHint}>Cargando colecciones...</p>
      ) : (
        <>
          {collections.length > 0 && (
            <div className={styles.collectionList}>
              {collections.map((c) => (
                <label key={c.id} className={styles.collectionRow}>
                  <input
                    type="radio"
                    name="collection"
                    checked={selectedId === c.id && !creating}
                    disabled={creating}
                    onChange={() => setSelectedId(c.id)}
                  />
                  <FolderIcon size={13} color={tokens.accent} />
                  <span className={styles.collectionRowName}>{c.name}</span>
                  <span className={styles.collectionRowMeta}>
                    {c.studyCount} img{c.course ? ` · ${c.course}` : ''}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className={formStyles.field}>
            <label className={formStyles.label}>
              {collections.length > 0 ? 'O crear una nueva colección' : 'Crear una colección'}
            </label>
            <input
              className={formStyles.input}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ej: Patología Gastrointestinal"
            />
          </div>
        </>
      )}

      {error && <div className={formStyles.error}>{error}</div>}

      <div className={formStyles.actions}>
        <button className={formStyles.cancelBtn} onClick={onClose} disabled={saving}>
          Cancelar
        </button>
        <button className={formStyles.submitBtn} onClick={handleSubmit} disabled={!canSubmit}>
          {saving ? 'Agregando...' : creating ? 'Crear y agregar' : 'Agregar'}
        </button>
      </div>
    </Modal>
  );
};
