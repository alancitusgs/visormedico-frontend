import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { statsService } from '@/services/stats.service';
import type { DashboardStats } from '@/types';
import { tokens } from '@/theme';
import { ImagesIcon, BookIcon, CodeIcon, GlobeIcon } from '@/components/Icon/icons';
import { StatCard } from './StatCard';
import { ActivityFeed } from './ActivityFeed';
import { QuickActions } from './QuickActions';
import styles from './DashboardPage.module.css';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export const DashboardPage: FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    statsService.getDashboard().then(setStats).catch(() => {});
  }, []);

  return (
    <div className={styles.page}>
      <p className={styles.greeting}>{getGreeting()}, {user?.username ?? 'Doctor'}</p>
      <p className={styles.date}>
        {new Date().toLocaleDateString('es-PE', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>

      <div className={styles.statsGrid}>
        <StatCard icon={ImagesIcon} value={String(stats?.totalImages ?? 0)} label="Imágenes DICOM" color={tokens.accent} />
        <StatCard icon={BookIcon} value={String(stats?.totalCourses ?? 0)} label="Asignaturas" color={tokens.blue} />
        {/* <StatCard icon={FolderIcon} value={String(stats?.totalCollections ?? 0)} label="Colecciones por curso" color={tokens.amber} /> */}
        <StatCard icon={CodeIcon} value={String(stats?.totalEmbeds ?? 0)} label="Visores publicados" color={tokens.purple} />
        <StatCard icon={GlobeIcon} value={String(stats?.totalCorsDomains ?? 0)} label="Dominios CORS" color={tokens.cyan} />
      </div>

      <div className={styles.bottomGrid}>
        <ActivityFeed />
        <QuickActions />
      </div>
    </div>
  );
};
