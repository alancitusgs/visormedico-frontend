import type { FC } from 'react';
import type { IconProps } from '@/components/Icon/icons';
import { Card } from '@/components';

interface StatCardProps {
  icon: FC<IconProps>;
  value: string;
  label: string;
  color: string;
}

export const StatCard: FC<StatCardProps> = ({ icon: Icon, value, label, color }) => (
  <Card style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: '10px',
        background: `${color}12`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon color={color} />
    </div>
    <div>
      <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--color-text-ter)', marginTop: 2 }}>
        {label}
      </div>
    </div>
  </Card>
);
