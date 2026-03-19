import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FC } from 'react';
import type { Collection } from '@/types';
import { tokens } from '@/theme';
import { Card, Button } from '@/components';
import { ConfirmDeleteModal } from '@/components/Modal/ConfirmDeleteModal';
import { PlusIcon, FolderIcon, TrashIcon, PencilIcon } from '@/components/Icon/icons';
import { collectionsService } from '@/services/collections.service';
import { CollectionFormModal } from './CollectionFormModal';
import styles from './CollectionsPage.module.css';

const colorFallbacks = [tokens.accent, tokens.blue, tokens.purple, tokens.amber, tokens.cyan, tokens.green];

export const CollectionsPage: FC = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editCollection, setEditCollection] = useState<Collection | undefined>();
  const [deleteCollection, setDeleteCollection] = useState<Collection | null>(null);

  const load = () => collectionsService.getCollections().then(setCollections).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleSaved = (saved: Collection) => {
    if (editCollection) {
      setCollections((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
    } else {
      setCollections((prev) => [saved, ...prev]);
    }
    setShowForm(false);
    setEditCollection(undefined);
  };

  const handleDelete = async () => {
    if (!deleteCollection) return;
    await collectionsService.deleteCollection(deleteCollection.id);
    setCollections((prev) => prev.filter((c) => c.id !== deleteCollection.id));
    setDeleteCollection(null);
  };

  const openEdit = (e: React.MouseEvent, collection: Collection) => {
    e.stopPropagation();
    setEditCollection(collection);
    setShowForm(true);
  };

  const openDelete = (e: React.MouseEvent, collection: Collection) => {
    e.stopPropagation();
    setDeleteCollection(collection);
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Button primary small onClick={() => { setEditCollection(undefined); setShowForm(true); }}>
          <PlusIcon color="#fff" /> Nueva Colección
        </Button>
      </div>
      <div className={styles.grid}>
        {collections.length === 0 && (
          <p style={{ color: 'var(--color-text-ter)', fontSize: 13, gridColumn: '1/-1' }}>
            No hay colecciones registradas. Crea una para empezar.
          </p>
        )}
        {collections.map((c, i) => {
          const clr = colorFallbacks[i % colorFallbacks.length];
          return (
            <Card key={c.id} noPad style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(`/collections/${c.id}`)}>
              <div className={styles.colorBar} style={{ background: clr }} />
              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon} style={{ background: `${clr}12` }}>
                    <FolderIcon color={clr} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.collectionName}>{c.name}</div>
                    {c.course && <div className={styles.collectionCourse}>{c.course}</div>}
                  </div>
                  <div className={styles.cardActions}>
                    <button className={styles.actionBtn} onClick={(e) => openEdit(e, c)} title="Editar">
                      <PencilIcon size={13} color={tokens.textTer} />
                    </button>
                    <button className={styles.actionBtn} onClick={(e) => openDelete(e, c)} title="Eliminar">
                      <TrashIcon size={13} color={tokens.red} />
                    </button>
                  </div>
                </div>
                <div className={styles.collectionStats}>
                  <strong>{c.studyCount}</strong> estudios
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {showForm && (
        <CollectionFormModal
          collection={editCollection}
          onSaved={handleSaved}
          onClose={() => { setShowForm(false); setEditCollection(undefined); }}
        />
      )}

      {deleteCollection && (
        <ConfirmDeleteModal
          title="Eliminar colección"
          message={`¿Estás seguro de que deseas eliminar "${deleteCollection.name}"? Las imágenes asignadas se desvinculan, no se eliminan.`}
          onConfirm={handleDelete}
          onClose={() => setDeleteCollection(null)}
        />
      )}
    </div>
  );
};
