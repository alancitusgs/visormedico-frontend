import type { FC } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  DashboardIcon,
  UploadIcon,
  ImagesIcon,
  MonitorIcon,
  CalendarIcon,
  BookIcon,
  // GradIcon,
  CodeIcon,
  GlobeIcon,
  LogoutIcon,
  CollapseIcon,
  ExpandIcon,
} from '@/components/Icon/icons';
import type { IconProps } from '@/components/Icon/icons';

const LOGO_URL =
  'https://develop-core-upch-psilva.d1axekf15a9bbd.amplifyapp.com/assets/logo-icon.DC7S9UPC.png';

interface NavItem {
  icon: FC<IconProps>;
  label: string;
  path: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    label: 'PRINCIPAL',
    items: [
      { icon: DashboardIcon, label: 'Inicio', path: '/dashboard' },
      { icon: UploadIcon, label: 'Subir DICOM', path: '/upload' },
      { icon: ImagesIcon, label: 'Biblioteca', path: '/library' },
      { icon: MonitorIcon, label: 'Visor', path: '/viewer' },
    ],
  },
  {
    label: 'ACADÉMICO',
    items: [
      { icon: CalendarIcon, label: 'Periodos', path: '/periods' },
      { icon: BookIcon, label: 'Asignaturas', path: '/courses' },
      // { icon: GradIcon, label: 'Colecciones', path: '/collections' },
    ],
  },
  {
    label: 'COMPARTIR',
    items: [
      { icon: CodeIcon, label: 'Visores', path: '/embeds' },
      { icon: GlobeIcon, label: 'Dominios CORS', path: '/cors' },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export const Sidebar: FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="shrink-0 bg-sidebar flex flex-col overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{ width: collapsed ? 60 : 232 }}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-2.5 border-b border-white/[0.06] min-h-14 ${
          collapsed ? 'px-3 justify-center' : 'px-4'
        }`}
      >
        <img src={LOGO_URL} alt="CORE UPCH" className="w-7 h-7 object-contain shrink-0" />
        {!collapsed && (
          <div>
            <div className="text-[13px] font-bold text-[#D9D9D9] whitespace-nowrap leading-tight">
              CORE UPCH
            </div>
            <div className="text-[9px] text-[#D9D9D9]/40 tracking-wider uppercase">
              VisuMed
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pb-2">
        {navigation.map((section) => (
          <div key={section.label}>
            {!collapsed ? (
              <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#D9D9D9]/35 px-4 pt-5 pb-1.5">
                {section.label}
              </div>
            ) : (
              <div className="h-4" />
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => {
                  const base =
                    'flex items-center gap-2.5 text-[13px] no-underline transition-all duration-150 cursor-pointer';
                  const active = isActive
                    ? 'bg-sidebar-active text-[#F4C542] font-semibold border-l-[3px] border-l-[#F4C542]'
                    : 'text-[#D9D9D9]/60 hover:bg-sidebar-hover hover:text-[#D9D9D9] border-l-[3px] border-l-transparent';
                  const layout = collapsed
                    ? 'w-11 mx-auto my-0.5 p-2.5 justify-center rounded-md !border-l-0'
                    : 'w-[calc(100%-16px)] mx-2 my-px py-2 px-2.5 rounded-md';
                  return `${base} ${active} ${layout}`;
                }}
              >
                {({ isActive }) => (
                  <>
                    <span className="shrink-0 flex">
                      <item.icon color={isActive ? '#F4C542' : 'rgba(217,217,217,0.5)'} />
                    </span>
                    {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <button
        className={`flex items-center gap-2.5 mx-2 py-2 px-2.5 rounded-md bg-transparent border-none cursor-pointer text-[#D9D9D9]/40 text-xs transition-all duration-150 hover:bg-sidebar-hover hover:text-[#D9D9D9]/70 font-[inherit] ${
          collapsed ? 'justify-center' : ''
        }`}
        onClick={handleLogout}
      >
        <span className="flex">
          <LogoutIcon color="rgba(217,217,217,0.4)" />
        </span>
        {!collapsed && <span>Cerrar sesión</span>}
      </button>

      {/* Developer credit */}
      <div
        className={`border-t border-white/[0.06] flex items-center gap-2 ${
          collapsed ? 'justify-center px-1 py-2' : 'px-4 py-2'
        }`}
      >
        <img src={LOGO_URL} alt="UPCH" className="w-4 h-4 object-contain shrink-0 opacity-70" />
        {!collapsed && (
          <span className="text-[9px] text-[#D9D9D9]/50 whitespace-nowrap">
            Desarrollado por DTI — UPCH
          </span>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        className="py-3 border-none bg-[#D9D9D9]/[0.03] border-t border-t-[#D9D9D9]/[0.08] cursor-pointer flex items-center justify-center gap-1.5 text-[#D9D9D9]/35 text-[11px] font-[inherit] hover:bg-sidebar-hover"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ExpandIcon color="rgba(217,217,217,0.35)" />
        ) : (
          <>
            <CollapseIcon color="rgba(217,217,217,0.35)" />
            <span className="whitespace-nowrap text-[#D9D9D9]/35">Colapsar</span>
          </>
        )}
      </button>
    </aside>
  );
};
