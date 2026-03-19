import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Card, Button } from '@/components';
import { CheckIcon } from '@/components/Icon/icons';
import { tokens } from '@/theme';
import { corsService } from '@/services/cors.service';
import styles from './CorsPage.module.css';

export const VerifyDomain: FC = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = domain.trim();
    if (!trimmed) return;

    setChecking(true);
    setResult(null);
    try {
      const { allowed } = await corsService.verifyDomain(trimmed);
      setResult(allowed);
    } catch {
      setResult(false);
    } finally {
      setChecking(false);
    }
  };

  return (
    <Card>
      <div className={styles.sectionTitle}>Verificar Dominio</div>
      <form onSubmit={handleVerify}>
        <div className={styles.verifyRow}>
          <input
            className={styles.verifyInput}
            placeholder="dominio.com"
            value={domain}
            onChange={(e) => { setDomain(e.target.value); setResult(null); }}
            disabled={checking}
          />
          <Button small type="submit" disabled={checking || !domain.trim()}>
            {checking ? '...' : 'Verificar'}
          </Button>
        </div>
      </form>
      {result !== null && (
        <div className={`${styles.verifyResult} ${result ? styles.verifyAllowed : styles.verifyDenied}`}>
          {result ? (
            <><CheckIcon color={tokens.green} size={12} /> Este dominio tiene acceso</>
          ) : (
            <><span style={{ fontWeight: 700 }}>✕</span> Este dominio no tiene acceso</>
          )}
        </div>
      )}
    </Card>
  );
};
