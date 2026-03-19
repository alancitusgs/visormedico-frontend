import { useState, useEffect, type FC } from 'react';
import { Link } from 'react-router-dom';
import type { Study, CorsDomain } from '@/types';
import { Card, Button } from '@/components';
import { embedsService } from '@/services/embeds.service';
import { corsService } from '@/services/cors.service';
import styles from './EmbedsPage.module.css';

interface EmbedCreatorProps {
  onCreated: (embedUrl: string) => void;
}

export const EmbedCreator: FC<EmbedCreatorProps> = ({ onCreated }) => {
  const [images, setImages] = useState<Study[]>([]);
  const [corsDomains, setCorsDomains] = useState<CorsDomain[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    embedsService.getImages().then((imgs) => {
      setImages(imgs);
      if (imgs.length > 0 && imgs[0]) setSelectedImageId(imgs[0].id);
    }).catch(() => {});

    corsService.getDomains().then((domains) => {
      const active = domains.filter((d) => d.status === 'active');
      setCorsDomains(active);
      if (active.length > 0 && active[0]) setSelectedDomain(active[0].domain);
    }).catch(() => {});
  }, []);

  const handleCreate = async () => {
    if (!selectedDomain) {
      setError('Selecciona un dominio');
      return;
    }
    if (!selectedImageId) {
      setError('Selecciona una imagen');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await embedsService.createEmbed(selectedImageId!, selectedDomain);
      onCreated(result.embed_url);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al crear el visor embebido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <div className={styles.sectionTitle}>Crear Visor</div>

      <label className={styles.fieldLabel}>Imagen a publicar</label>
      <select
        className={styles.select}
        value={selectedImageId ?? ''}
        onChange={(e) => setSelectedImageId(Number(e.target.value))}
      >
        <option value="" disabled>Selecciona una imagen</option>
        {images.map((img) => (
          <option key={img.id} value={img.id}>
            {img.original_name} {img.modality ? `(${img.modality})` : ''}
          </option>
        ))}
      </select>

      <label className={styles.fieldLabel}>Dominio autorizado</label>
      {corsDomains.length > 0 ? (
        <select
          className={styles.select}
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
        >
          {corsDomains.map((d) => (
            <option key={d.domain} value={d.domain}>
              {d.domain}
            </option>
          ))}
        </select>
      ) : (
        <div style={{ fontSize: 12, color: 'var(--color-text-ter)', marginBottom: 14 }}>
          No hay dominios CORS configurados.{' '}
          <Link to="/cors" style={{ color: 'var(--color-accent)' }}>
            Agregar dominio
          </Link>
        </div>
      )}

      {error && (
        <div style={{ color: '#e25950', fontSize: 12, marginBottom: 10 }}>{error}</div>
      )}

      <Button primary onClick={handleCreate} disabled={loading || corsDomains.length === 0}>
        {loading ? 'Creando...' : 'Crear Visor Embebido'}
      </Button>
    </Card>
  );
};
