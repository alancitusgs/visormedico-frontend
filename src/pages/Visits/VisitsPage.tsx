import { useEffect, useState } from 'react';
import type { FC } from 'react';
import type { VisitStats } from '@/types';
import { tokens } from '@/theme';
import { Card } from '@/components';
import { EyeIcon, CalendarIcon, UserIcon } from '@/components/Icon/icons';
import { statsService } from '@/services/stats.service';
import { StatCard } from '@/pages/Dashboard/StatCard';
import { VisitsChart } from './VisitsChart';
import styles from './VisitsPage.module.css';

const RANGES = [
  { days: 7, label: 'Últimos 7 días' },
  { days: 30, label: 'Últimos 30 días' },
  { days: 90, label: 'Últimos 90 días' },
];

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function refererHost(referer: string | null): string {
  if (!referer) return '—';
  try {
    return new URL(referer).hostname;
  } catch {
    return referer;
  }
}

export const VisitsPage: FC = () => {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    statsService
      .getVisits(days)
      .then((data) => { if (!cancelled) setStats(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [days]);

  const maxDevice = Math.max(...(stats?.devices.map((d) => d.count) ?? [0]), 1);

  return (
    <div className={styles.page}>
      {/* Filtro de rango: aplica a todo lo que está debajo */}
      <div className={styles.filters}>
        {RANGES.map((r) => (
          <button
            key={r.days}
            className={r.days === days ? styles.rangeBtnActive : styles.rangeBtn}
            onClick={() => setDays(r.days)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className={loading && stats ? styles.loading : undefined}>
        <div className={styles.statsGrid}>
          <StatCard
            icon={EyeIcon}
            value={(stats?.total ?? 0).toLocaleString('es-PE')}
            label="Visitas totales"
            color={tokens.accent}
          />
          <StatCard
            icon={CalendarIcon}
            value={(stats?.today ?? 0).toLocaleString('es-PE')}
            label="Visitas hoy"
            color={tokens.blue}
          />
          <StatCard
            icon={UserIcon}
            value={(stats?.uniqueVisitors30d ?? 0).toLocaleString('es-PE')}
            label={`Visitantes únicos (${days} días)`}
            color={tokens.purple}
          />
        </div>

        <div className={styles.chartsGrid}>
          <Card>
            <div className={styles.cardTitle}>Visitas por día</div>
            <div className={styles.cardSubtitle}>
              Accesos al visor compartido en los últimos {days} días
            </div>
            {stats && stats.perDay.some((d) => d.count > 0) ? (
              <VisitsChart data={stats.perDay} />
            ) : (
              <div className={styles.empty}>
                Aún no hay visitas registradas en este periodo.
              </div>
            )}
          </Card>

          <Card>
            <div className={styles.cardTitle}>Dispositivos</div>
            <div className={styles.cardSubtitle}>Visitas por tipo de dispositivo</div>
            {stats && stats.devices.length > 0 ? (
              stats.devices.map((d) => (
                <div key={d.device} className={styles.deviceRow}>
                  <span className={styles.deviceLabel}>{d.device}</span>
                  <div className={styles.deviceTrack}>
                    <div
                      className={styles.deviceFill}
                      style={{ width: `${(d.count / maxDevice) * 100}%` }}
                    />
                  </div>
                  <span className={styles.deviceValue}>{d.count.toLocaleString('es-PE')}</span>
                </div>
              ))
            ) : (
              <div className={styles.empty}>Sin datos.</div>
            )}
          </Card>
        </div>

        <Card noPad>
          <div style={{ padding: '16px 20px 4px' }}>
            <div className={styles.cardTitle}>Últimas visitas</div>
            <div className={styles.cardSubtitle}>Las 50 visitas más recientes</div>
          </div>
          {stats && stats.recent.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Fecha y hora</th>
                    <th>Contenido</th>
                    <th>Tipo</th>
                    <th>Dispositivo</th>
                    <th>Navegador</th>
                    <th>Sistema</th>
                    <th>IP</th>
                    <th>Origen</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map((v) => (
                    <tr key={v.id}>
                      <td>{formatDateTime(v.timestamp)}</td>
                      <td className={styles.targetCell} title={v.target}>{v.target}</td>
                      <td>
                        <span
                          className={styles.typeBadge}
                          style={
                            v.target_type === 'collection'
                              ? { background: tokens.purpleSoft, color: tokens.purple }
                              : { background: tokens.blueSoft, color: tokens.blue }
                          }
                        >
                          {v.target_type === 'collection' ? 'Colección' : 'Imagen'}
                        </span>
                      </td>
                      <td>{v.device ?? '—'}</td>
                      <td>{v.browser ?? '—'}</td>
                      <td>{v.os ?? '—'}</td>
                      <td>{v.ip ?? '—'}</td>
                      <td title={v.referer ?? undefined}>{refererHost(v.referer)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.empty}>Aún no hay visitas registradas.</div>
          )}
        </Card>
      </div>
    </div>
  );
};
