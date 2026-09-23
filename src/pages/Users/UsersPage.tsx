import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { ManagedUser, UserRole } from '@/types';
import { Card, Button } from '@/components';
import { ConfirmDeleteModal } from '@/components/Modal/ConfirmDeleteModal';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  EyeOffIcon,
} from '@/components/Icon/icons';
import { tokens } from '@/theme';
import { usersService } from '@/services/users.service';
import { useAuth } from '@/hooks/useAuth';
import styles from './UsersPage.module.css';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'estudiante', label: 'Estudiante' },
  { value: 'docente', label: 'Docente' },
  { value: 'admin', label: 'Administrador' },
];

const badgeClass: Record<UserRole, string | undefined> = {
  admin: styles.badgeAdmin,
  docente: styles.badgeDocente,
  estudiante: styles.badgeEstudiante,
};

const emptyForm = { email: '', password: '', role: 'estudiante' as UserRole };

const validateForm = (
  form: typeof emptyForm,
  isEdit: boolean,
): string | null => {
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(form.email.trim())) return 'Correo electrónico inválido.';
  if (!isEdit || form.password) {
    if (form.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      return 'La contraseña debe incluir al menos una letra y un número.';
    }
  }
  return null;
};

export const UsersPage: FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editUser, setEditUser] = useState<ManagedUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<ManagedUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => usersService.getUsers().then(setUsers).catch(() => {});

  useEffect(() => { load(); }, []);

  const setField = (field: 'email' | 'password') =>
    (value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    const validationError = validateForm(form, editUser !== null);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editUser) {
        const updated = await usersService.updateUser({
          id: editUser.id,
          email: form.email.trim(),
          role: form.role,
          ...(form.password ? { password: form.password } : {}),
        });
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        setEditUser(null);
      } else {
        const created = await usersService.createUser({
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        });
        setUsers((prev) => [created, ...prev]);
      }
      setForm(emptyForm);
      setShowPassword(false);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Error al guardar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (user: ManagedUser) => {
    setEditUser(user);
    setForm({ email: user.email, password: '', role: user.role });
    setError('');
  };

  const cancelEdit = () => {
    setEditUser(null);
    setForm(emptyForm);
    setError('');
    setShowPassword(false);
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    try {
      await usersService.deleteUser(deleteUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      if (editUser?.id === deleteUser.id) cancelEdit();
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Error al eliminar el usuario.');
    } finally {
      setDeleteUser(null);
    }
  };

  const formValid =
    form.email.trim().length > 0 &&
    (editUser !== null || form.password.length > 0);

  return (
    <div className={styles.page}>
      <div className={styles.contentGrid}>
        {/* Table */}
        <Card noPad>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Correo</th>
                <th className={styles.th}>Rol</th>
                <th className={styles.th}>Creado</th>
                <th className={styles.th} style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.empty}>No hay usuarios registrados.</td>
                </tr>
              )}
              {users.map((u) => {
                const isSelf = u.id === currentUser?.id;
                return (
                  <tr key={u.id} className={styles.tr}>
                    <td className={styles.tdName}>
                      {u.email}
                      {isSelf && <span className={styles.selfTag}>(tú)</span>}
                    </td>
                    <td className={styles.tdEmail}>
                      <span className={`${styles.badge} ${badgeClass[u.role] ?? ''}`}>{u.role}</span>
                    </td>
                    <td className={styles.tdDate}>
                      {new Date(u.created_at).toLocaleDateString('es-PE', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className={styles.tdActions}>
                      <button className={styles.actionBtn} onClick={() => startEdit(u)} title="Editar">
                        <PencilIcon size={13} color={tokens.textTer} />
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => setDeleteUser(u)}
                        disabled={isSelf}
                        title={isSelf ? 'No puedes eliminar tu propia cuenta' : 'Eliminar'}
                      >
                        <TrashIcon size={13} color={tokens.red} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Form */}
        <Card>
          <div className={styles.formTitle}>
            {editUser ? `Editar usuario: ${editUser.email}` : 'Nuevo usuario'}
          </div>

          <label className={styles.label}>Correo institucional</label>
          <input
            className={styles.input}
            type="email"
            value={form.email}
            onChange={(e) => setField('email')(e.target.value)}
            placeholder="usuario@upch.pe"
            autoComplete="off"
            maxLength={255}
          />

          <label className={styles.label}>Contraseña</label>
          <div className={styles.passwordWrap}>
            <input
              className={styles.input}
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setField('password')(e.target.value)}
              placeholder={editUser ? 'Dejar en blanco para no cambiar' : 'Mínimo 8 caracteres'}
              autoComplete="new-password"
              maxLength={128}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword((v) => !v)}
              title={showPassword ? 'Ocultar' : 'Mostrar'}
            >
              {showPassword ? (
                <EyeOffIcon size={14} color={tokens.textTer} />
              ) : (
                <EyeIcon size={14} color={tokens.textTer} />
              )}
            </button>
          </div>
          <div className={styles.hint}>Mínimo 8 caracteres, con al menos una letra y un número.</div>

          <label className={styles.label}>Rol</label>
          <select
            className={styles.select}
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as UserRole }))}
            disabled={editUser !== null && editUser.id === currentUser?.id}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          {editUser !== null && editUser.id === currentUser?.id && (
            <div className={styles.hint}>No puedes cambiar tu propio rol.</div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <Button
            primary
            small
            style={{ width: '100%', marginTop: 14, justifyContent: 'center' }}
            disabled={saving || !formValid}
            onClick={handleSubmit}
          >
            {saving ? 'Guardando...' : editUser ? (
              <><PencilIcon size={13} color="#fff" /> Guardar cambios</>
            ) : (
              <><PlusIcon color="#fff" /> Crear usuario</>
            )}
          </Button>
          {editUser && (
            <button className={styles.cancelLink} onClick={cancelEdit}>
              Cancelar edición
            </button>
          )}
        </Card>
      </div>

      {deleteUser && (
        <ConfirmDeleteModal
          title="Eliminar usuario"
          message={`¿Eliminar a "${deleteUser.email}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onClose={() => setDeleteUser(null)}
        />
      )}
    </div>
  );
};
