import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { CorsDomain } from '@/types';
import { Card } from '@/components';
import { InfoIcon } from '@/components/Icon/icons';
import { tokens } from '@/theme';
import { corsService } from '@/services/cors.service';
import { DomainTable } from './DomainTable';
import { AddDomainForm } from './AddDomainForm';
import { VerifyDomain } from './VerifyDomain';
import styles from './CorsPage.module.css';

export const CorsPage: FC = () => {
  const [domains, setDomains] = useState<CorsDomain[]>([]);
  const [domainToDelete, setDomainToDelete] = useState<CorsDomain | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    corsService.getDomains().then(setDomains).catch(() => {});
  }, []);

  const handleAdd = (domain: CorsDomain) => {
    setDomains((prev) => [domain, ...prev]);
  };

  const handleDelete = (domain: string) => {
    const found = domains.find((d) => d.domain === domain);
    if (found) setDomainToDelete(found);
  };

  const confirmDelete = async () => {
    if (!domainToDelete) return;
    setDeleting(true);
    try {
      await corsService.deleteDomain(domainToDelete.domain);
      setDomains((prev) => prev.filter((d) => d.domain !== domainToDelete.domain));
      setDomainToDelete(null);
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Info banner */}
      <Card style={{ marginBottom: 20, background: 'rgba(0,115,230,0.04)', border: '1px solid rgba(0,115,230,0.15)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <InfoIcon color={tokens.blue} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>
              ¿Qué son los dominios CORS?
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-sec)', lineHeight: 1.6 }}>
              Los dominios CORS determinan qué sitios web pueden mostrar tus imágenes embebidas.
              Agrega aquí los dominios de tu campus virtual para que los visores funcionen.
            </div>
          </div>
        </div>
      </Card>

      <div className={styles.contentGrid}>
        <DomainTable domains={domains} onDelete={handleDelete} />
        <div>
          <AddDomainForm onAdd={handleAdd} />
          <VerifyDomain />
        </div>
      </div>

      {domainToDelete && (
        <div className={styles.overlay} onClick={() => !deleting && setDomainToDelete(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTitle}>Eliminar dominio</div>
            <p className={styles.modalText}>
              ¿Estás seguro de que deseas eliminar <strong>{domainToDelete.domain}</strong>?
              Los visores embebidos en este dominio dejarán de funcionar.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setDomainToDelete(null)}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                className={styles.modalDeleteBtn}
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
