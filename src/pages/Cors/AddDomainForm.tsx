import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import type { CorsDomain } from '@/types';
import { Card, Button } from '@/components';
import { PlusIcon } from '@/components/Icon/icons';
import { corsService } from '@/services/cors.service';
import styles from './CorsPage.module.css';

interface AddDomainFormProps {
  onAdd: (domain: CorsDomain) => void;
}

export const AddDomainForm: FC<AddDomainFormProps> = ({ onAdd }) => {
  const [domain, setDomain] = useState('');
  const [desc, setDesc] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = domain.trim();
    if (!trimmed) return;

    setAdding(true);
    setError('');
    try {
      const created = await corsService.addDomain(trimmed, desc.trim());
      onAdd(created);
      setDomain('');
      setDesc('');
    } catch (err: any) {
      const msg = err?.response?.data?.detail;
      setError(typeof msg === 'string' ? msg : 'Error al agregar dominio');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <div className={styles.sectionTitle}>Agregar Dominio</div>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <span className={styles.inputPrefix}>https://</span>
          <input
            className={styles.inputField}
            placeholder="campus.universidad.edu"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={adding}
          />
        </div>
        <input
          className={styles.descInput}
          placeholder="Descripción (opcional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          disabled={adding}
        />
        {error && (
          <div style={{ fontSize: 11, color: 'var(--color-red, #e25950)', marginBottom: 8 }}>
            {error}
          </div>
        )}
        <Button primary type="submit" style={{ width: '100%', justifyContent: 'center' }} disabled={adding || !domain.trim()}>
          <PlusIcon color="#fff" /> {adding ? 'Agregando...' : 'Agregar Dominio'}
        </Button>
      </form>
    </Card>
  );
};
