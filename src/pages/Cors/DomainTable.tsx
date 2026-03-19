import type { FC } from 'react';
import type { CorsDomain } from '@/types';
import { Card, StatusDot } from '@/components';
import { TrashIcon } from '@/components/Icon/icons';
import { tokens } from '@/theme';
import styles from './CorsPage.module.css';

interface DomainTableProps {
  domains: CorsDomain[];
  onDelete: (domain: string) => void;
}

export const DomainTable: FC<DomainTableProps> = ({ domains, onDelete }) => (
  <Card>
    <div className={styles.sectionTitle}>Dominios Permitidos</div>
    {domains.length === 0 ? (
      <div className={styles.emptyState}>
        No hay dominios registrados. Agrega uno para empezar.
      </div>
    ) : (
      <table className={styles.table}>
        <thead>
          <tr>
            {['Dominio', 'Descripción', 'Embeds', 'Estado', ''].map((h) => (
              <th key={h} className={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {domains.map((d) => (
            <tr key={d.domain} className={styles.tr}>
              <td className={styles.tdDomain}>{d.domain}</td>
              <td className={styles.tdDesc}>{d.desc}</td>
              <td className={styles.tdEmbeds}>{d.embeds}</td>
              <td className={styles.td}><StatusDot status={d.status} /></td>
              <td className={styles.td}>
                <button
                  className={styles.deleteBtn}
                  onClick={() => onDelete(d.domain)}
                >
                  <TrashIcon color={tokens.red} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </Card>
);
