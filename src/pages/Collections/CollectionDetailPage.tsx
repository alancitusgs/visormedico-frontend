import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { FC } from 'react';
import type { CollectionDetail, Collection, Study } from '@/types';
import { tokens } from '@/theme';
import { Card, Button, Modal } from '@/components';
import { ConfirmDeleteModal } from '@/components/Modal/ConfirmDeleteModal';
import { FolderIcon, PlusIcon, PencilIcon, TrashIcon } from '@/components/Icon/icons';
import { collectionsService } from '@/services/collections.service';
import { http } from '@/services/http';
import { CollectionFormModal } from './CollectionFormModal';
import styles from './CollectionDetailPage.module.css';
import formStyles from '@/components/Modal/ModalForm.module.css';

export const CollectionDetailPage: FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<CollectionDetail | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAddImages, setShowAddImages] = useState(false);
  const [allImages, setAllImages] = useState<Study[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [adding, setAdding] = useState(false);

  const load = () => {
    if (!collectionId) return;
    collectionsService.getCollection(Number(collectionId)).then(setDetail).catch(() => navigate('/collections'));
  };

  useEffect(() => { load(); }, [collectionId]);

  if (!detail) return null;

  const openAddImages = async () => {
    try {
      const { data } = await http.get<Study[]>('/admin/images');
      setAllImages(data);
      setSelectedIds([]);
      setShowAddImages(true);
    } catch { /* ignore */ }
  };

  const handleAddImages = async () => {
    if (selectedIds.length === 0) return;
    setAdding(true);
    try {
      await collectionsService.addImages(detail.id, selectedIds);
      setShowAddImages(false);
      load();
    } catch { /* ignore */ }
    finally { setAdding(false); }
  };

  const handleRemoveImage = async (imageId: number) => {
    await collectionsService.removeImage(detail.id, imageId);
    load();
  };

  const handleEdited = (updated: Collection) => {
    setDetail((prev) => prev ? { ...prev, ...updated } : prev);
    setShowEdit(false);
  };

  const handleDeleted = async () => {
    await collectionsService.deleteCollection(detail.id);
    navigate('/collections');
  };

  const toggleImageId = (id: number) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const existingIds = new Set(detail.images.map((img) => img.id));
  const availableImages = allImages.filter((img) => !existingIds.has(img.id));

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/collections')}>
          &larr; Colecciones
        </button>
        <div className={styles.headerMain}>
          <div className={styles.headerIcon}>
            <FolderIcon color={tokens.accent} size={24} />
          </div>
          <div>
            <h1 className={styles.title}>{detail.name}</h1>
            {detail.course && <span className={styles.subtitle}>{detail.course}</span>}
          </div>
          <div className={styles.headerActions}>
            <Button small onClick={() => setShowEdit(true)}>
              <PencilIcon size={13} color={tokens.textSec} /> Editar
            </Button>
            <Button small onClick={() => setShowDelete(true)}>
              <TrashIcon size={13} color={tokens.red} /> Eliminar
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <div className={styles.statValue}>{detail.studyCount}</div>
          <div className={styles.statLabel}>Imágenes</div>
        </Card>
      </div>

      {/* Images */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Imágenes en esta colección</h2>
        <Button primary small onClick={openAddImages}>
          <PlusIcon color="#fff" /> Agregar imágenes
        </Button>
      </div>

      {detail.images.length === 0 ? (
        <p style={{ color: 'var(--color-text-ter)', fontSize: 13 }}>
          No hay imágenes en esta colección. Agrega imágenes para empezar.
        </p>
      ) : (
        <Card noPad>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Nombre</th>
                <th className={styles.th}>Paciente</th>
                <th className={styles.th}>Modalidad</th>
                <th className={styles.th}>Fecha</th>
                <th className={styles.th} style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {detail.images.map((img) => (
                <tr key={img.id} className={styles.tr}>
                  <td className={styles.tdName}>{img.original_name}</td>
                  <td className={styles.td}>{img.patient_name || '—'}</td>
                  <td className={styles.td}>{img.modality || '—'}</td>
                  <td className={styles.td}>{img.study_date || '—'}</td>
                  <td className={styles.td}>
                    <button className={styles.removeBtn} onClick={() => handleRemoveImage(img.id)} title="Quitar de colección">
                      <TrashIcon size={13} color={tokens.red} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <CollectionFormModal collection={detail} onSaved={handleEdited} onClose={() => setShowEdit(false)} />
      )}

      {/* Delete Modal */}
      {showDelete && (
        <ConfirmDeleteModal
          title="Eliminar colección"
          message={`¿Eliminar "${detail.name}"? Las imágenes se desvinculan, no se eliminan.`}
          onConfirm={handleDeleted}
          onClose={() => setShowDelete(false)}
        />
      )}

      {/* Add Images Modal */}
      {showAddImages && (
        <Modal title="Agregar imágenes a la colección" onClose={() => setShowAddImages(false)}>
          {availableImages.length === 0 ? (
            <p style={{ color: 'var(--color-text-ter)', fontSize: 13 }}>
              No hay imágenes disponibles para agregar.
            </p>
          ) : (
            <div className={styles.imageList}>
              {availableImages.map((img) => (
                <label key={img.id} className={styles.imageRow}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(img.id)}
                    onChange={() => toggleImageId(img.id)}
                  />
                  <span className={styles.imageName}>{img.original_name}</span>
                  <span className={styles.imageMeta}>{img.modality || '—'}</span>
                </label>
              ))}
            </div>
          )}
          <div className={formStyles.actions}>
            <button className={formStyles.cancelBtn} onClick={() => setShowAddImages(false)}>
              Cancelar
            </button>
            <button
              className={formStyles.submitBtn}
              onClick={handleAddImages}
              disabled={adding || selectedIds.length === 0}
            >
              {adding ? 'Agregando...' : `Agregar ${selectedIds.length} imagen${selectedIds.length !== 1 ? 'es' : ''}`}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
