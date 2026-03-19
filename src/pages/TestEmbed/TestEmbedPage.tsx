import { useState, type FC } from 'react';

/**
 * Test page that simulates an external site embedding the VisuMed viewer.
 * Access at /prueba — not part of the real app, just for dev testing.
 */
export const TestEmbedPage: FC = () => {
  const [token, setToken] = useState('');
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  const handleLoad = () => {
    const clean = token.trim().replace(/^\/+/, '');
    if (!clean) return;
    setActiveUrl(`/shared/${clean}`);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f5f5f5', minHeight: '100vh', padding: 40 }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Sitio Externo Simulado</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        Esta pagina simula un campus virtual que incrusta un visor VisuMed via iframe.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Pega el share token aqui..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 13 }}
        />
        <button
          onClick={handleLoad}
          style={{
            padding: '8px 20px',
            borderRadius: 6,
            border: 'none',
            background: '#0073e6',
            color: '#fff',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Cargar Visor
        </button>
      </div>

      {activeUrl && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 8, fontFamily: 'monospace' }}>
            iframe src=&quot;{activeUrl}&quot;
          </div>
          <iframe
            src={activeUrl}
            width="100%"
            height="600"
            frameBorder="0"
            allow="fullscreen"
            style={{ border: 'none', borderRadius: 8 }}
            title="VisuMed Viewer"
          />
        </div>
      )}
    </div>
  );
};
