import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Period } from '@/types';
import { Card, Button } from '@/components';
import { ConfirmDeleteModal } from '@/components/Modal/ConfirmDeleteModal';
import { PlusIcon, TrashIcon, PencilIcon } from '@/components/Icon/icons';
import { tokens } from '@/theme';
import { periodsService } from '@/services/periods.service';
import styles from './PeriodsPage.module.css';

export const PeriodsPage: FC = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [name, setName] = useState('');
  const [editPeriod, setEditPeriod] = useState<Period | null>(null);
  const [deletePeriod, setDeletePeriod] = useState<Period | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => periodsService.getPeriods().then(setPeriods).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    try {
      if (editPeriod) {
        const updated = await periodsService.updatePeriod(editPeriod.id, name.trim());
        setPeriods((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setEditPeriod(null);
      } else {
        const created = await periodsService.createPeriod(name.trim());
        setPeriods((prev) => [created, ...prev]);
      }
      setName('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (period: Period) => {
    setEditPeriod(period);
    setName(period.name);
    setError('');
  };

  const cancelEdit = () => {
    setEditPeriod(null);
    setName('');
    setError('');
  };

  const handleDelete = async () => {
    if (!deletePeriod) return;
    await periodsService.deletePeriod(deletePeriod.id);
    setPeriods((prev) => prev.filter((p) => p.id !== deletePeriod.id));
    setDeletePeriod(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.contentGrid}>
        {/* Table */}
        <Card noPad>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Periodo</th>
                <th className={styles.th}>Asignaturas</th>
                <th className={styles.th} style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {periods.length === 0 && (
                <tr>
                  <td colSpan={3} className={styles.empty}>No hay periodos registrados.</td>
                </tr>
              )}
              {periods.map((p) => (
                <tr key={p.id} className={styles.tr}>
                  <td className={styles.tdName}>{p.name}</td>
                  <td className={styles.tdCount}>{p.course_count}</td>
                  <td className={styles.tdActions}>
                    <button className={styles.actionBtn} onClick={() => startEdit(p)} title="Editar">
                      <PencilIcon size={13} color={tokens.textTer} />
                    </button>
                    <button className={styles.actionBtn} onClick={() => setDeletePeriod(p)} title="Eliminar">
                      <TrashIcon size={13} color={tokens.red} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Form */}
        <Card>
          <div className={styles.formTitle}>
            {editPeriod ? 'Editar periodo' : 'Nuevo periodo'}
          </div>
          <label className={styles.label}>Nombre del periodo</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: 2026-I"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {error && <div className={styles.error}>{error}</div>}
          <Button
            primary
            small
            style={{ width: '100%', marginTop: 10, justifyContent: 'center' }}
            disabled={saving || !name.trim()}
            onClick={handleSubmit}
          >
            {saving ? 'Guardando...' : editPeriod ? (
              <><PencilIcon size={13} color="#fff" /> Guardar cambios</>
            ) : (
              <><PlusIcon color="#fff" /> Crear periodo</>
            )}
          </Button>
          {editPeriod && (
            <button className={styles.cancelLink} onClick={cancelEdit}>
              Cancelar edición
            </button>
          )}
        </Card>
      </div>

      {deletePeriod && (
        <ConfirmDeleteModal
          title="Eliminar periodo"
          message={`¿Eliminar "${deletePeriod.name}"? Las asignaturas vinculadas quedarán sin periodo.`}
          onConfirm={handleDelete}
          onClose={() => setDeletePeriod(null)}
        />
      )}
    </div>
  );
};
