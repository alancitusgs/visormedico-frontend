import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SearchIcon, BellIcon } from '@/components/Icon/icons';

const pageTitles: Record<string, [string, string]> = {
  '/dashboard': ['Inicio', 'Panel principal'],
  '/upload': ['Subir DICOM', 'Carga de imágenes médicas'],
  '/library': ['Biblioteca', 'Todas las imágenes DICOM'],
  '/viewer': ['Visor de imágenes médicas', ''],
  '/courses': ['Asignaturas', 'Gestión de asignaturas académicas'],
  // '/collections': ['Colecciones', 'Agrupaciones de imágenes por asignatura'],
  '/embeds': ['Visores Publicados', 'Generador de visores embebidos'],
  '/cors': ['Dominios CORS', 'Control de acceso por dominio'],
  '/periods': ['Periodos', 'Gestión de periodos académicos'],
};

export const Header: FC = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const basePath = '/' + (pathname.split('/')[1] ?? 'dashboard');
  const [title, subtitle] = pageTitles[basePath] ?? ['', ''];
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'VM';

  return (
    <header className="px-7 flex items-center justify-between border-b border-[var(--color-border)] bg-white h-14 shrink-0">
      <div>
        <h1 className="text-base font-bold m-0 text-[var(--color-text)]">{title}</h1>
        <p className="text-[11px] text-[var(--color-text-ter)] m-0">
          {subtitle}
          {subtitle && <span className="text-[var(--color-text-ter)] opacity-50 mx-1.5">·</span>}
          <span className="text-[11px] text-[var(--color-text-sec)] font-medium">Desarrollado por DTI — UPCH</span>
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Search */}
        <div className="flex items-center gap-2 py-1.5 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] w-50">
          <SearchIcon color="var(--color-text-ter)" />
          <input
            className="border-none outline-none bg-transparent text-xs text-[var(--color-text)] w-full font-[inherit]"
            placeholder="Buscar..."
          />
          <kbd className="text-[9px] py-px px-1.5 rounded-sm border border-[var(--color-border)] text-[var(--color-text-light)] font-[inherit]">
            Ctrl+K
          </kbd>
        </div>

        {/* Notifications */}
        <div className="w-8 h-8 rounded-md border border-[var(--color-border)] flex items-center justify-center relative cursor-pointer">
          <BellIcon color="var(--color-text-sec)" />
          <span className="absolute top-[5px] right-[5px] w-1.5 h-1.5 rounded-full bg-danger border-2 border-white" />
        </div>

        {/* User */}
        <div className="flex items-center gap-2 ml-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white text-[11px] font-bold">
            {initials}
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--color-text)] leading-tight">
              {user?.username ?? 'Usuario'}
            </div>
            <div className="text-[10px] text-[var(--color-text-ter)]">
              {user?.role ?? 'Docente'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
