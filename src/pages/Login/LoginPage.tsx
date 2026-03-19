import { useState, useEffect } from 'react';
import type { FC, KeyboardEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  UserIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  LoaderIcon,
} from '@/components/Icon/icons';

const LOGO_URL =
  'https://develop-core-upch-psilva.d1axekf15a9bbd.amplifyapp.com/assets/logo-icon.DC7S9UPC.png';
const BG_IMAGE =
  'https://s3.amazonaws.com/ecosistema.documentos.upch/imagenes/universidad-fachada-1.jpg';

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [dni, setDni] = useState('');
  const [pass, setPass] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async () => {
    if (!dni.trim() || !pass.trim()) {
      setError('Completa todos los campos');
      return;
    }
    if (!/^\d{8}$/.test(dni.trim())) {
      setError('El DNI debe tener 8 dígitos');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(dni, pass);
      setLoading(false);
      setSuccess(true);
    } catch {
      setLoading(false);
      setError('Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => navigate('/dashboard'), 1900);
      return () => clearTimeout(t);
    }
  }, [success, navigate]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleDniChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 8);
    setDni(v);
  };

  /* ── Success state ── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-barlow">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center mx-auto mb-5 animate-success-pop shadow-lg">
            <CheckIcon color="#fff" size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">¡Bienvenido!</h2>
          <p className="text-sm text-gray-500">Ingresando al sistema...</p>
          <div className="mt-5 h-1 rounded-full overflow-hidden bg-gray-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-success to-primary animate-shimmer"
              style={{ backgroundSize: '200% 100%' }}
            />
          </div>
        </div>
      </div>
    );
  }

  /* ── Main login ── */
  return (
    <div className="min-h-screen flex font-barlow">
      {/* ── Left panel: Image ── */}
      <div className="hidden lg:block lg:w-[60%] relative overflow-hidden">
        <img
          src={BG_IMAGE}
          alt="Universidad Peruana Cayetano Heredia"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* ── Right panel: Form ── */}
      <div
        className="w-full lg:w-[40%] flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 bg-white relative"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <img src={LOGO_URL} alt="CORE UPCH" className="w-10 h-10 object-contain" />
            <div className="leading-tight">
              <div className="text-sm font-bold text-gray-900">CORE</div>
              <div className="text-sm font-bold text-gray-900">UPCH</div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Iniciar Sesión</h1>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          {/* DNI */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">DNI</label>
            <div className="flex items-center border border-gray-300 rounded-lg h-12 px-4 bg-white transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              <input
                type="text"
                inputMode="numeric"
                className="flex-1 border-none outline-none bg-transparent text-sm text-gray-900 font-barlow placeholder:text-gray-400"
                placeholder="99999991"
                value={dni}
                onChange={handleDniChange}
                onKeyDown={handleKeyDown}
                maxLength={8}
              />
              <UserIcon color="#9ca3af" />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Contraseña</label>
            <div className="flex items-center border border-gray-300 rounded-lg h-12 px-4 bg-white transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              <input
                type={showPass ? 'text' : 'password'}
                className="flex-1 border-none outline-none bg-transparent text-sm text-gray-900 font-barlow placeholder:text-gray-400"
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPass ? (
                  <EyeOffIcon color="currentColor" size={18} />
                ) : (
                  <EyeIcon color="currentColor" size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Remember */}
          <label className="flex items-center gap-2 mb-6 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-primary"
            />
            <span className="text-sm text-gray-600">Recordar usuario</span>
          </label>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-12 rounded-full bg-primary hover:bg-primary-hover text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer shadow-lg shadow-primary/25"
          >
            {loading ? (
              <>
                <span className="animate-spin inline-flex">
                  <LoaderIcon color="#fff" />
                </span>
                Verificando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>

          {/* Forgot password */}
          <div className="text-center mt-6">
            <button
              type="button"
              className="text-sm text-primary hover:underline font-medium cursor-pointer"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-xs text-gray-400">
            ©2026 Universidad Peruana Cayetano Heredia
          </p>
        </div>
      </div>
    </div>
  );
};
