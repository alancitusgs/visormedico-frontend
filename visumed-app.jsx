import { useState, useEffect } from "react";

/* ════════════════════════════════════════════════════════════════
   VisuMed — Full App: Login → Dashboard System
   ════════════════════════════════════════════════════════════════ */

const T = {
  bg: "#f4f7fa", card: "#ffffff",
  sidebar: "#0a2540", sidebarHover: "#12344d", sidebarActive: "#1b3f5e",
  accent: "#635bff", accentHover: "#5249e0",
  accentSoft: "rgba(99,91,255,0.08)", accentSoft2: "rgba(99,91,255,0.15)",
  blue: "#0073e6", blueSoft: "rgba(0,115,230,0.08)",
  purple: "#a855f7", purpleSoft: "rgba(168,85,247,0.08)",
  cyan: "#06b6d4", cyanSoft: "rgba(6,182,212,0.08)",
  green: "#30b566", greenSoft: "rgba(48,181,102,0.08)",
  amber: "#f5a623", amberSoft: "rgba(245,166,35,0.08)",
  red: "#e25950", redSoft: "rgba(226,89,80,0.08)",
  text: "#0a2540", textSec: "#425466", textTer: "#8898aa", textLight: "#b0bec5",
  border: "#e6ebf1", borderLight: "#f0f4f8",
  shadow: "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
  shadowLg: "0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)",
  radius: "8px", radiusSm: "6px", radiusLg: "16px", radiusPill: "20px",
};

/* ─── GLOBAL STYLES ─── */
const GlobalStyles = () => (
  <style>{`
    @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
    @keyframes fadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
    @keyframes scaleIn { from { opacity:0; transform:scale(0.95) } to { opacity:1; transform:scale(1) } }
    @keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
    @keyframes shimmer { 0% { background-position:-200% 0 } 100% { background-position:200% 0 } }
    @keyframes successPop { 0% { transform:scale(0.5);opacity:0 } 50% { transform:scale(1.1) } 100% { transform:scale(1);opacity:1 } }
    @keyframes slideOut { from { opacity:1; transform:scale(1) } to { opacity:0; transform:scale(0.96) } }
    @keyframes slideInSystem { from { opacity:0 } to { opacity:1 } }
    * { box-sizing:border-box; margin:0 }
    input::placeholder, textarea::placeholder { color:${T.textLight} }
    select { appearance:auto }
    ::-webkit-scrollbar { width:6px }
    ::-webkit-scrollbar-track { background:transparent }
    ::-webkit-scrollbar-thumb { background:#d0d5dd; border-radius:3px }
  `}</style>
);

/* ─── SVG ICONS ─── */
const I = {
  Dashboard: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Upload: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Images: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>,
  Monitor: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Book: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Grad: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></svg>,
  Code: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Globe: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Settings: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Search: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Bell: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.75" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Eye: (c,s) => <svg width={s||14} height={s||14} viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: (c,s) => <svg width={s||14} height={s||14} viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Copy: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Trash: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Check: (c,s) => <svg width={s||14} height={s||14} viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Plus: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Chevron: (c) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ZoomIn: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  ZoomOut: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  Sun: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Rotate: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Maximize: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  Folder: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.75" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Info: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Collapse: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Expand: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  User: (c,s) => <svg width={s||18} height={s||18} viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Lock: (c,s) => <svg width={s||18} height={s||18} viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Arrow: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||"#fff"} strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Loader: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||"#fff"} strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
  Shield: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.75" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Logout: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.75" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Download: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Share: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
};

/* ─── MOCK DATA ─── */
const mockStudies = [
  { id:"VIS-0124", title:"TC Tórax — Derrame Pleural", course:"Anatomía II", modality:"CT", date:"15 Dic 2024", images:120, tags:["tórax","derrame"] },
  { id:"VIS-0123", title:"RM Cerebral — Glioblastoma", course:"Patología General", modality:"MR", date:"15 Dic 2024", images:84, tags:["cerebral","tumor"] },
  { id:"VIS-0122", title:"Rx Tórax PA — Neumotórax", course:"Radiología Clínica", modality:"CR", date:"14 Dic 2024", images:2, tags:["tórax","neumotórax"] },
  { id:"VIS-0121", title:"Eco Abdominal — Colelitiasis", course:"Anatomía I", modality:"US", date:"14 Dic 2024", images:36, tags:["abdomen","vesícula"] },
  { id:"VIS-0120", title:"TC Abdomen — Apendicitis", course:"Patología General", modality:"CT", date:"13 Dic 2024", images:95, tags:["abdomen","apéndice"] },
  { id:"VIS-0119", title:"DX Columna Lumbar — Hernia", course:"Radiología Clínica", modality:"DX", date:"12 Dic 2024", images:4, tags:["columna","hernia"] },
];
const mockCors = [
  { domain:"campus.continental.edu.pe", desc:"Campus Virtual Moodle", embeds:12, status:"active" },
  { domain:"lms.medicina.edu.pe", desc:"LMS Facultad Medicina", embeds:6, status:"active" },
  { domain:"docs.hospital-escuela.org", desc:"Hospital Escuela", embeds:3, status:"active" },
  { domain:"localhost:3000", desc:"Desarrollo local", embeds:0, status:"dev" },
];
const mockCourses = [
  { name:"Anatomía II", semester:"2024-II", images:148, collections:5, embeds:8, color:T.accent },
  { name:"Patología General", semester:"2024-II", images:92, collections:3, embeds:5, color:T.purple },
  { name:"Radiología Clínica", semester:"2024-II", images:67, collections:4, embeds:3, color:T.blue },
  { name:"Cardiología I", semester:"2024-II", images:35, collections:2, embeds:2, color:T.cyan },
];
const mockEmbeds = [
  { content:"TC Tórax — Derrame Pleural", type:"Imagen", domain:"campus.continental.edu.pe", views:234, status:"active", expires:"30 Jun 2025" },
  { content:"Colección Fracturas", type:"Colección", domain:"lms.medicina.edu.pe", views:189, status:"active", expires:"30 Jun 2025" },
  { content:"RM Cerebral — Glioblastoma", type:"Imagen", domain:"campus.continental.edu.pe", views:412, status:"expired", expires:"01 Dic 2024" },
];

/* ─── SHARED COMPONENTS ─── */
const ModalityBadge = ({ mod }) => {
  const m = { CT:T.accent, MR:T.purple, CR:T.green, US:T.cyan, DX:T.amber };
  const c = m[mod]||T.accent;
  return <span style={{ display:"inline-flex",padding:"2px 8px",borderRadius:"4px",fontSize:"10px",fontWeight:700,letterSpacing:"0.06em",background:c+"16",color:c,border:`1px solid ${c}30` }}>{mod}</span>;
};
const StatusDot = ({ status }) => {
  const m = { active:T.green, expired:T.red, dev:T.amber };
  const l = { active:"Activo", expired:"Expirado", dev:"Dev" };
  return <span style={{ display:"inline-flex",alignItems:"center",gap:5,fontSize:"12px",color:m[status] }}><span style={{ width:6,height:6,borderRadius:"50%",background:m[status] }}/>{l[status]}</span>;
};
const Tag = ({ children }) => <span style={{ display:"inline-flex",padding:"1px 8px",borderRadius:T.radiusPill,fontSize:"10px",background:T.bg,color:T.textSec,border:`1px solid ${T.border}` }}>{children}</span>;
const Btn = ({ children, primary, small, onClick, style:s }) => <button onClick={onClick} style={{ display:"inline-flex",alignItems:"center",gap:6,padding:small?"5px 12px":"8px 16px",borderRadius:T.radiusSm,border:primary?"none":`1px solid ${T.border}`,background:primary?T.accent:"#fff",color:primary?"#fff":T.text,fontSize:small?"12px":"13px",fontWeight:600,cursor:"pointer",transition:"all 0.15s",...s }}>{children}</button>;
const Card = ({ children, style:s, noPad }) => <div style={{ background:T.card,borderRadius:T.radius,boxShadow:T.shadow,padding:noPad?0:"20px 24px",...s }}>{children}</div>;
const SectionLabel = ({ children }) => <div style={{ fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",padding:"20px 16px 6px" }}>{children}</div>;

/* ═══════════════════════════════════════════
   LOGIN SCREEN
   ═══════════════════════════════════════════ */
const LoginScreen = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusField, setFocusField] = useState(null);

  useEffect(() => { setMounted(true) }, []);

  const handleSubmit = () => {
    if (!user.trim()||!pass.trim()) { setError("Completa todos los campos"); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1600);
  };

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setExiting(true), 1400);
      const t2 = setTimeout(() => onLogin(), 1900);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
  }, [success]);

  const inputStyle = (field) => ({
    display:"flex",alignItems:"center",gap:10,padding:"0 14px",height:48,borderRadius:T.radius,
    border:`1.5px solid ${focusField===field?T.accent:T.border}`,
    background:focusField===field?"#fff":"#fafbfc",
    transition:"all 0.2s cubic-bezier(0.4,0,0.2,1)",
    boxShadow:focusField===field?`0 0 0 3px ${T.accentSoft}`:"none",
  });

  return (
    <div style={{
      minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      background:"linear-gradient(160deg,#f8f9fc 0%,#f0f2f8 35%,#eef0f7 65%,#f4f5fa 100%)",
      fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif",
      position:"relative",overflow:"hidden",padding:24,
      animation: exiting ? "slideOut 0.5s cubic-bezier(0.4,0,0.2,1) forwards" : "none",
    }}>
      <div style={{ position:"absolute",top:"-20%",right:"-10%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,91,255,0.04) 0%,transparent 70%)",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",bottom:"-15%",left:"-8%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,115,230,0.03) 0%,transparent 70%)",pointerEvents:"none" }}/>

      <div style={{
        width:"100%",maxWidth:420,background:T.card,borderRadius:T.radiusLg,
        boxShadow:T.shadowLg,padding:"40px 36px 32px",position:"relative",zIndex:1,
        animation:mounted?"fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) forwards":"none",
        opacity:mounted?1:0,
      }}>
        {success ? (
          <div style={{ textAlign:"center",padding:"20px 0",animation:"scaleIn 0.4s cubic-bezier(0.4,0,0.2,1) forwards" }}>
            <div style={{ width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${T.green},#28a058)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",boxShadow:"0 4px 16px rgba(48,181,102,0.3)",animation:"successPop 0.5s cubic-bezier(0.4,0,0.2,1) forwards" }}>
              {I.Check("#fff",28)}
            </div>
            <div style={{ fontSize:"20px",fontWeight:700,color:T.text,marginBottom:6 }}>¡Bienvenido, Dr. García!</div>
            <div style={{ fontSize:"13px",color:T.textTer }}>Ingresando al sistema...</div>
            <div style={{ marginTop:20,height:3,borderRadius:2,overflow:"hidden",background:T.border }}>
              <div style={{ height:"100%",borderRadius:2,width:"100%",background:`linear-gradient(90deg,${T.green},${T.accent})`,animation:"shimmer 1.5s linear infinite",backgroundSize:"200% 100%" }}/>
            </div>
          </div>
        ) : (
          <>
            <div style={{ textAlign:"center",marginBottom:32 }}>
              <div style={{ width:52,height:52,borderRadius:"14px",background:`linear-gradient(135deg,${T.accent},${T.blue})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 4px 16px rgba(99,91,255,0.25)" }}>
                <span style={{ color:"#fff",fontSize:"24px",fontWeight:800,fontFamily:"Georgia,serif" }}>V</span>
              </div>
              <h1 style={{ fontSize:"22px",fontWeight:700,color:T.text,margin:"0 0 4px",letterSpacing:"-0.02em" }}>VisuMed</h1>
              <p style={{ fontSize:"13px",color:T.textTer,margin:0 }}>Plataforma educativa de imágenes médicas</p>
            </div>

            {error && (
              <div style={{ padding:"10px 14px",borderRadius:T.radius,background:"rgba(226,89,80,0.06)",border:"1px solid rgba(226,89,80,0.15)",fontSize:"12px",color:T.red,marginBottom:16,display:"flex",alignItems:"center",gap:8,animation:"fadeUp 0.3s ease" }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:T.red,flexShrink:0 }}/>{error}
              </div>
            )}

            <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:16 }}>
              <div>
                <label style={{ fontSize:"12px",fontWeight:600,color:T.textSec,display:"block",marginBottom:6 }}>Usuario</label>
                <div style={inputStyle("user")}>
                  {I.User(focusField==="user"?T.accent:T.textTer)}
                  <input type="text" placeholder="correo@universidad.edu" value={user} onChange={e=>setUser(e.target.value)} onFocus={()=>setFocusField("user")} onBlur={()=>setFocusField(null)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} style={{ flex:1,border:"none",outline:"none",background:"transparent",fontSize:"14px",color:T.text,fontFamily:"inherit" }}/>
                </div>
              </div>
              <div>
                <label style={{ fontSize:"12px",fontWeight:600,color:T.textSec,display:"block",marginBottom:6 }}>Contraseña</label>
                <div style={inputStyle("pass")}>
                  {I.Lock(focusField==="pass"?T.accent:T.textTer)}
                  <input type={showPass?"text":"password"} placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onFocus={()=>setFocusField("pass")} onBlur={()=>setFocusField(null)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} style={{ flex:1,border:"none",outline:"none",background:"transparent",fontSize:"14px",color:T.text,fontFamily:"inherit",letterSpacing:showPass?"0":"0.1em" }}/>
                  <button onClick={()=>setShowPass(!showPass)} style={{ background:"none",border:"none",cursor:"pointer",display:"flex",padding:2 }}>
                    {showPass ? I.EyeOff(T.textTer,16) : I.Eye(T.textTer,16)}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
              <label style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none" }}>
                <div onClick={()=>setRemember(!remember)} style={{ width:18,height:18,borderRadius:"5px",flexShrink:0,border:remember?"none":`1.5px solid ${T.border}`,background:remember?T.accent:"#fff",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",boxShadow:remember?`0 0 0 3px ${T.accentSoft}`:"none" }}>
                  {remember && I.Check("#fff",12)}
                </div>
                <span style={{ fontSize:"13px",color:T.textSec }}>Recordar sesión</span>
              </label>
              <button style={{ background:"none",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:500,color:T.accent,padding:0 }}>¿Olvidaste tu contraseña?</button>
            </div>

            <button onClick={handleSubmit} disabled={loading} style={{ width:"100%",height:48,borderRadius:T.radius,background:loading?T.accent:`linear-gradient(135deg,${T.accent},${T.accentHover})`,border:"none",cursor:loading?"default":"pointer",color:"#fff",fontSize:"14px",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s",boxShadow:"0 2px 8px rgba(99,91,255,0.25)",opacity:loading?0.85:1 }}>
              {loading ? <><span style={{ animation:"spin 0.8s linear infinite",display:"flex" }}>{I.Loader()}</span>Verificando...</> : <>Ingresar {I.Arrow()}</>}
            </button>

            <div style={{ display:"flex",alignItems:"center",gap:12,margin:"24px 0 16px" }}>
              <div style={{ flex:1,height:1,background:T.border }}/><span style={{ fontSize:"10px",color:T.textLight,letterSpacing:"0.08em",textTransform:"uppercase" }}>Acceso institucional</span><div style={{ flex:1,height:1,background:T.border }}/>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:T.radius,background:"#fafbfc",border:`1px solid ${T.border}` }}>
              {I.Shield(T.textTer)}
              <p style={{ fontSize:"11px",color:T.textTer,margin:0,lineHeight:1.5 }}>Usa las credenciales proporcionadas por tu institución educativa.</p>
            </div>
          </>
        )}
      </div>
      <div style={{ marginTop:28,textAlign:"center",animation:mounted?"fadeUp 0.5s 0.15s cubic-bezier(0.4,0,0.2,1) both":"none" }}>
        <p style={{ fontSize:"11px",color:T.textTer,margin:"0 0 4px" }}>VisuMed v1.0 — Plataforma de Imágenes Médicas Educativas</p>
        <p style={{ fontSize:"10px",color:T.textLight,margin:0 }}>© 2024 Universidad Continental · Facultad de Medicina</p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   SYSTEM — SIDEBAR
   ═══════════════════════════════════════════ */
const Sidebar = ({ page, setPage, collapsed, setCollapsed, onLogout }) => {
  const sections = [
    { label:"PRINCIPAL", items:[
      { icon:I.Dashboard, label:"Inicio", page:"dashboard" },
      { icon:I.Upload, label:"Subir DICOM", page:"upload" },
      { icon:I.Images, label:"Biblioteca", page:"library" },
      { icon:I.Monitor, label:"Visor", page:"viewer" },
    ]},
    { label:"ACADÉMICO", items:[
      { icon:I.Book, label:"Asignaturas", page:"courses" },
      { icon:I.Grad, label:"Colecciones", page:"collections" },
    ]},
    { label:"COMPARTIR", items:[
      { icon:I.Code, label:"Visores", page:"embeds" },
      { icon:I.Globe, label:"Dominios CORS", page:"cors" },
    ]},
  ];
  return (
    <aside style={{ width:collapsed?60:232,flexShrink:0,background:T.sidebar,display:"flex",flexDirection:"column",transition:"width 0.3s cubic-bezier(0.4,0,0.2,1)",overflow:"hidden" }}>
      <div style={{ padding:collapsed?"16px 12px":"16px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid rgba(255,255,255,0.06)",minHeight:56,justifyContent:collapsed?"center":"flex-start" }}>
        <div style={{ width:30,height:30,borderRadius:"8px",flexShrink:0,background:`linear-gradient(135deg,${T.accent},${T.blue})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"14px",fontWeight:800,fontFamily:"Georgia,serif" }}>V</div>
        {!collapsed && <div><div style={{ fontSize:"14px",fontWeight:700,color:"#fff",whiteSpace:"nowrap",letterSpacing:"-0.02em" }}>VisuMed</div><div style={{ fontSize:"9px",color:"rgba(255,255,255,0.35)",letterSpacing:"0.08em",textTransform:"uppercase" }}>Imágenes Médicas</div></div>}
      </div>
      <nav style={{ flex:1,overflowY:"auto",paddingBottom:8 }}>
        {sections.map((sec,si) => (
          <div key={si}>
            {!collapsed && <SectionLabel>{sec.label}</SectionLabel>}
            {collapsed && <div style={{ height:16 }}/>}
            {sec.items.map((item,ii) => {
              const active = page===item.page;
              return <button key={ii} onClick={()=>setPage(item.page)} style={{ width:collapsed?44:"calc(100% - 16px)",margin:collapsed?"2px auto":"1px 8px",display:"flex",alignItems:"center",gap:10,padding:collapsed?"9px":"8px 10px",borderRadius:T.radiusSm,border:"none",cursor:"pointer",justifyContent:collapsed?"center":"flex-start",background:active?T.sidebarActive:"transparent",color:active?"#fff":"rgba(255,255,255,0.45)",fontSize:"13px",fontWeight:active?600:400,transition:"all 0.12s",borderLeft:active&&!collapsed?`3px solid ${T.accent}`:"3px solid transparent" }}>
                <span style={{ flexShrink:0,display:"flex" }}>{item.icon(active?"#fff":"rgba(255,255,255,0.4)")}</span>
                {!collapsed && <span style={{ whiteSpace:"nowrap" }}>{item.label}</span>}
              </button>;
            })}
          </div>
        ))}
      </nav>
      {/* Logout + Collapse */}
      <button onClick={onLogout} style={{ margin:collapsed?"4px 8px":"4px 8px",padding:collapsed?"9px":"8px 10px",borderRadius:T.radiusSm,border:"none",cursor:"pointer",background:"transparent",color:"rgba(255,255,255,0.35)",display:"flex",alignItems:"center",gap:10,fontSize:"12px",justifyContent:collapsed?"center":"flex-start",transition:"all 0.15s" }}>
        <span style={{ display:"flex" }}>{I.Logout("rgba(255,255,255,0.35)")}</span>
        {!collapsed && <span>Cerrar sesión</span>}
      </button>
      <button onClick={()=>setCollapsed(!collapsed)} style={{ padding:"12px",border:"none",background:"rgba(255,255,255,0.03)",borderTop:"1px solid rgba(255,255,255,0.06)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:"rgba(255,255,255,0.3)",fontSize:"11px" }}>
        {collapsed ? I.Expand("rgba(255,255,255,0.3)") : <>{I.Collapse("rgba(255,255,255,0.3)")}<span style={{ whiteSpace:"nowrap" }}>Colapsar</span></>}
      </button>
    </aside>
  );
};

/* ─── HEADER ─── */
const Header = ({ page }) => {
  const titles = { dashboard:["Inicio","Panel principal"], upload:["Subir DICOM","Carga de imágenes médicas"], library:["Biblioteca","Todas las imágenes DICOM"], viewer:["Visor DICOM","Visualización de imágenes"], courses:["Asignaturas","Gestión de asignaturas académicas"], collections:["Colecciones","Agrupaciones de imágenes por asignatura"], embeds:["Visores Publicados","Generador de visores embebidos"], cors:["Dominios CORS","Control de acceso por dominio"] };
  const [t,sub] = titles[page]||["",""];
  return (
    <header style={{ padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.border}`,background:T.card,height:56,flexShrink:0 }}>
      <div><h1 style={{ fontSize:"16px",fontWeight:700,margin:0,color:T.text }}>{t}</h1><p style={{ fontSize:"11px",color:T.textTer,margin:0 }}>{sub}</p></div>
      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 12px",borderRadius:T.radiusSm,border:`1px solid ${T.border}`,background:T.bg,width:200 }}>
          {I.Search(T.textTer)}<input placeholder="Buscar..." style={{ border:"none",outline:"none",background:"transparent",fontSize:"12px",color:T.text,width:"100%",fontFamily:"inherit" }}/><kbd style={{ fontSize:"9px",padding:"1px 5px",borderRadius:"3px",border:`1px solid ${T.border}`,color:T.textLight }}>⌘K</kbd>
        </div>
        <div style={{ width:32,height:32,borderRadius:T.radiusSm,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",cursor:"pointer" }}>{I.Bell(T.textSec)}<span style={{ position:"absolute",top:5,right:5,width:6,height:6,borderRadius:"50%",background:T.red,border:"2px solid #fff" }}/></div>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginLeft:4 }}>
          <div style={{ width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${T.accent},${T.blue})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"11px",fontWeight:700 }}>AG</div>
          <div><div style={{ fontSize:"12px",fontWeight:600,color:T.text,lineHeight:1.2 }}>Dr. García</div><div style={{ fontSize:"10px",color:T.textTer }}>Docente</div></div>
        </div>
      </div>
    </header>
  );
};

/* ═══════════════════════════════════════════
   PAGES
   ═══════════════════════════════════════════ */
const Dashboard = ({ setPage }) => (
  <div style={{ animation:"fadeIn 0.3s ease" }}>
    <p style={{ fontSize:"20px",fontWeight:700,color:T.text,margin:"0 0 4px" }}>Buenos días, Dr. García</p>
    <p style={{ fontSize:"13px",color:T.textTer,margin:"0 0 24px" }}>Domingo 15 de diciembre, 2024</p>
    <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,marginBottom:24 }}>
      {[{ icon:I.Images,val:"342",label:"Imágenes DICOM",c:T.accent },{ icon:I.Book,val:"5",label:"Asignaturas",c:T.blue },{ icon:I.Folder,val:"14",label:"Colecciones por curso",c:T.amber },{ icon:I.Code,val:"18",label:"Visores publicados",c:T.purple },{ icon:I.Globe,val:"4",label:"Dominios CORS",c:T.cyan }].map((k,i) => (
        <Card key={i} style={{ display:"flex",alignItems:"center",gap:14 }}><div style={{ width:42,height:42,borderRadius:"10px",background:k.c+"12",display:"flex",alignItems:"center",justifyContent:"center" }}>{k.icon(k.c)}</div><div><div style={{ fontSize:"26px",fontWeight:700,color:T.text,lineHeight:1 }}>{k.val}</div><div style={{ fontSize:"11px",color:T.textTer,marginTop:2 }}>{k.label}</div></div></Card>
      ))}
    </div>
    <div style={{ display:"grid",gridTemplateColumns:"1fr 280px",gap:16 }}>
      <Card>
        <div style={{ fontSize:"14px",fontWeight:700,color:T.text,marginBottom:16 }}>Actividad Reciente</div>
        {[{ icon:I.Upload,text:"Subiste 12 imágenes CT a Anatomía II",time:"hace 2h",c:T.accent },{ icon:I.Code,text:"Nuevo visor publicado para Patología Torácica",time:"hace 5h",c:T.purple },{ icon:I.Globe,text:"Dominio campus.continental.edu.pe agregado",time:"ayer",c:T.cyan },{ icon:I.Folder,text:'Colección "Fracturas Comunes" actualizada',time:"hace 2d",c:T.blue }].map((a,i) => (
          <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:12,padding:"10px 0",borderBottom:i<3?`1px solid ${T.borderLight}`:"none" }}><div style={{ width:32,height:32,borderRadius:"8px",background:a.c+"10",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{a.icon(a.c)}</div><div style={{ flex:1 }}><div style={{ fontSize:"13px",color:T.text }}>{a.text}</div><div style={{ fontSize:"11px",color:T.textTer,marginTop:2 }}>{a.time}</div></div></div>
        ))}
      </Card>
      <Card>
        <div style={{ fontSize:"14px",fontWeight:700,color:T.text,marginBottom:16 }}>Accesos Rápidos</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
          {[{ icon:I.Upload,label:"Subir imágenes",c:T.accent,p:"upload" },{ icon:I.Code,label:"Publicar visor",c:T.purple,p:"embeds" },{ icon:I.Globe,label:"Gestionar CORS",c:T.cyan,p:"cors" },{ icon:I.Folder,label:"Nueva colección",c:T.blue,p:"collections" }].map((b,i) => (
            <button key={i} onClick={()=>setPage(b.p)} style={{ padding:"16px 10px",borderRadius:T.radius,border:`1px solid ${T.border}`,background:b.c+"06",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8,transition:"all 0.15s" }}>{b.icon(b.c)}<span style={{ fontSize:"11px",fontWeight:600,color:T.textSec }}>{b.label}</span></button>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

const UploadPage = () => {
  const [files,setFiles] = useState([]);
  return (
    <div style={{ animation:"fadeIn 0.3s ease",display:"grid",gridTemplateColumns:"1fr 300px",gap:20 }}>
      <div>
        <div onClick={()=>setFiles([...files,{name:`serie_${files.length+1}.dcm`,size:"24.3 MB",mod:"CT"}])} style={{ border:`2px dashed ${T.border}`,borderRadius:"12px",padding:"56px 40px",textAlign:"center",cursor:"pointer",background:T.card,transition:"all 0.2s",marginBottom:20 }}>
          <div style={{ marginBottom:12 }}>{I.Upload(T.textTer)}</div>
          <div style={{ fontSize:"16px",fontWeight:600,color:T.text,marginBottom:4 }}>Arrastra archivos DICOM aquí</div>
          <div style={{ fontSize:"13px",color:T.textTer }}>o haz click para seleccionar — acepta .dcm y carpetas</div>
        </div>
        {files.length>0 && <Card><div style={{ fontSize:"13px",fontWeight:600,color:T.text,marginBottom:12 }}>Archivos subidos</div>{files.map((f,i)=>(<div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.borderLight}` }}><ModalityBadge mod={f.mod}/><span style={{ flex:1,fontSize:"13px",color:T.text }}>{f.name}</span><span style={{ fontSize:"11px",color:T.textTer }}>{f.size}</span><span style={{ fontSize:"11px",color:T.green,fontWeight:600,display:"flex",alignItems:"center",gap:4 }}>{I.Check(T.green,12)} Listo</span></div>))}</Card>}
        <Card style={{ marginTop:16 }}>
          <div style={{ fontSize:"13px",fontWeight:600,color:T.text,marginBottom:14 }}>Asignar a</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
            <div><label style={{ fontSize:"11px",fontWeight:600,color:T.textSec,display:"block",marginBottom:4 }}>Asignatura</label><select style={{ width:"100%",padding:"8px 10px",borderRadius:T.radiusSm,border:`1px solid ${T.border}`,fontSize:"13px",color:T.text,background:"#fff" }}><option>Anatomía II</option><option>Patología General</option><option>Radiología Clínica</option></select></div>
            <div><label style={{ fontSize:"11px",fontWeight:600,color:T.textSec,display:"block",marginBottom:4 }}>Colección</label><select style={{ width:"100%",padding:"8px 10px",borderRadius:T.radiusSm,border:`1px solid ${T.border}`,fontSize:"13px",color:T.text,background:"#fff" }}><option>Patología Torácica</option><option>+ Crear nueva</option></select></div>
          </div>
          <label style={{ fontSize:"11px",fontWeight:600,color:T.textSec,display:"block",marginBottom:4 }}>Etiquetas</label>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:12 }}><Tag>tórax</Tag><Tag>derrame</Tag><Tag>TC con contraste</Tag><span style={{ padding:"1px 8px",borderRadius:T.radiusPill,fontSize:"10px",border:`1px dashed ${T.border}`,color:T.textTer,cursor:"pointer" }}>+ agregar</span></div>
        </Card>
      </div>
      <Card>
        <div style={{ fontSize:"13px",fontWeight:600,color:T.text,marginBottom:16 }}>Resumen de carga</div>
        {[["Archivos",files.length||"—"],["Peso total",files.length?`${(files.length*24.3).toFixed(1)} MB`:"—"],["Modalidades",files.length?"CT":"—"]].map(([k,v],i)=>(<div key={i} style={{ display:"flex",justifyContent:"space-between",fontSize:"12px",marginBottom:8 }}><span style={{ color:T.textTer }}>{k}</span><span style={{ fontWeight:600,color:T.text }}>{v}</span></div>))}
        <Btn primary style={{ width:"100%",marginTop:16,justifyContent:"center",opacity:files.length?1:0.4 }}>Confirmar y Subir</Btn>
      </Card>
    </div>
  );
};

const Library = ({ setPage }) => (
  <div style={{ animation:"fadeIn 0.3s ease" }}>
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
      <div style={{ display:"flex",gap:8 }}>{["Asignatura","Modalidad"].map(f=><button key={f} style={{ padding:"6px 14px",borderRadius:T.radiusPill,border:`1px solid ${T.border}`,background:"#fff",fontSize:"12px",color:T.textSec,cursor:"pointer",display:"flex",alignItems:"center",gap:4 }}>{f} {I.Chevron()}</button>)}</div>
      <Btn primary small onClick={()=>setPage("upload")}>{I.Plus("#fff")} Subir imágenes</Btn>
    </div>
    <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
      {mockStudies.map((s,i)=>(
        <Card key={i} noPad style={{ overflow:"hidden",cursor:"pointer" }}>
          <div style={{ height:130,background:"linear-gradient(135deg,#1a1a2e,#16213e)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
            <div style={{ width:44,height:44,borderRadius:"12px",background:"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center" }}>{I.Images("rgba(255,255,255,0.2)")}</div>
            <div style={{ position:"absolute",top:10,right:10 }}><ModalityBadge mod={s.modality}/></div>
            <div style={{ position:"absolute",bottom:8,left:10,fontSize:"10px",color:"rgba(255,255,255,0.5)" }}>{s.images} imágenes</div>
          </div>
          <div style={{ padding:"14px 16px" }}><div style={{ fontSize:"13px",fontWeight:600,color:T.text,marginBottom:4,lineHeight:1.3 }}>{s.title}</div><div style={{ fontSize:"11px",color:T.textTer,marginBottom:8 }}>{s.course} · {s.date}</div><div style={{ display:"flex",gap:4 }}>{s.tags.map(t=><Tag key={t}>{t}</Tag>)}</div></div>
        </Card>
      ))}
    </div>
  </div>
);

const Viewer = () => (
  <div style={{ animation:"fadeIn 0.3s ease",display:"flex",margin:"-24px -28px",height:"calc(100vh - 56px)" }}>
    <div style={{ width:220,background:T.card,borderRight:`1px solid ${T.border}`,padding:"16px 12px",overflowY:"auto",flexShrink:0 }}>
      <div style={{ fontSize:"11px",fontWeight:700,color:T.textTer,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:12 }}>Series (3)</div>
      {["Axial con contraste","Coronal","Sagital"].map((s,i)=>(
        <div key={i} style={{ display:"flex",gap:10,padding:"8px",borderRadius:T.radiusSm,marginBottom:4,cursor:"pointer",background:i===0?T.accentSoft:"transparent",borderLeft:i===0?`3px solid ${T.accent}`:"3px solid transparent" }}>
          <div style={{ width:48,height:48,borderRadius:"6px",background:"#1a1a2e",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}><div style={{ width:30,height:30,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.15)" }}/></div>
          <div><div style={{ fontSize:"12px",fontWeight:i===0?600:400,color:T.text }}>{s}</div><div style={{ fontSize:"10px",color:T.textTer }}>120 cortes</div><ModalityBadge mod="CT"/></div>
        </div>
      ))}
      <div style={{ borderTop:`1px solid ${T.border}`,marginTop:12,paddingTop:12 }}>
        <div style={{ fontSize:"11px",fontWeight:700,color:T.textTer,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8 }}>Info del caso</div>
        {[["Caso","Caso Clínico 024"],["Asignatura","Anatomía II"],["Docente","Dr. García"]].map(([k,v],i)=>(<div key={i} style={{ display:"flex",justifyContent:"space-between",fontSize:"11px",marginBottom:4 }}><span style={{ color:T.textTer }}>{k}</span><span style={{ color:T.text,fontWeight:500 }}>{v}</span></div>))}
      </div>
    </div>
    <div style={{ flex:1,background:"#12151e",display:"flex",flexDirection:"column",position:"relative" }}>
      <div style={{ display:"flex",justifyContent:"center",padding:"10px",position:"absolute",top:0,left:0,right:0,zIndex:10 }}>
        <div style={{ display:"flex",gap:2,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(12px)",borderRadius:T.radius,padding:"4px 6px" }}>
          {[I.ZoomIn,I.ZoomOut,I.Sun,I.Rotate,I.Maximize].map((Ic,i)=><button key={i} style={{ width:32,height:32,borderRadius:"6px",border:"none",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>{Ic("rgba(255,255,255,0.7)")}</button>)}
          <div style={{ width:1,background:"rgba(255,255,255,0.1)",margin:"4px" }}/>
          <select style={{ background:"rgba(255,255,255,0.08)",border:"none",color:"rgba(255,255,255,0.7)",fontSize:"11px",padding:"4px 8px",borderRadius:"4px" }}><option>Lung</option><option>Bone</option><option>Brain</option></select>
        </div>
      </div>
      <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
        <div style={{ position:"absolute",top:52,left:16,fontSize:"11px",color:"rgba(255,255,255,0.6)",fontFamily:"monospace",lineHeight:1.6 }}>Caso Clínico 024<br/>TC Tórax con contraste</div>
        <div style={{ position:"absolute",top:52,right:16,fontSize:"11px",color:"rgba(255,255,255,0.6)",fontFamily:"monospace",textAlign:"right",lineHeight:1.6 }}>Anatomía II<br/>Dr. García</div>
        <div style={{ position:"absolute",bottom:44,left:16,fontSize:"11px",color:"#38bdf8",fontFamily:"monospace" }}>WL: 400 / WW: 1500</div>
        <div style={{ position:"absolute",bottom:44,right:16,fontSize:"11px",color:"#38bdf8",fontFamily:"monospace" }}>Zoom: 100% — Corte: 45/120</div>
        <div style={{ width:280,height:280,borderRadius:"50%",background:"radial-gradient(ellipse at 45% 40%,#3a3f55 0%,#252838 40%,#1a1d2e 70%)",boxShadow:"0 0 80px rgba(56,189,248,0.05)",position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:"30%",left:"35%",width:"30%",height:"25%",background:"rgba(200,200,220,0.06)",borderRadius:"40%",filter:"blur(6px)" }}/>
        </div>
      </div>
      <div style={{ padding:"8px 20px 14px",display:"flex",alignItems:"center",gap:10 }}>
        <span style={{ fontSize:"10px",color:"rgba(255,255,255,0.4)",fontFamily:"monospace" }}>1</span>
        <input type="range" min="1" max="120" defaultValue="45" style={{ flex:1,accentColor:T.accent }}/>
        <span style={{ fontSize:"10px",color:"rgba(255,255,255,0.4)",fontFamily:"monospace" }}>120</span>
      </div>
    </div>
    <div style={{ width:240,background:T.card,borderLeft:`1px solid ${T.border}`,overflowY:"auto",flexShrink:0 }}>
      <div style={{ display:"flex",borderBottom:`1px solid ${T.border}` }}>{["Metadata","Notas","Embed"].map((tab,i)=><button key={i} style={{ flex:1,padding:"12px 0",border:"none",borderBottom:i===0?`2px solid ${T.accent}`:"2px solid transparent",background:"transparent",fontSize:"11px",fontWeight:i===0?700:500,color:i===0?T.accent:T.textTer,cursor:"pointer" }}>{tab}</button>)}</div>
      <div style={{ padding:"14px" }}>{[["Modality","CT"],["Body Part","CHEST"],["Slice","1.25 mm"],["Pixel","0.68 mm"],["WC","400"],["WW","1500"],["Rows","512"],["Cols","512"]].map(([k,v],i)=>(<div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.borderLight}`,fontSize:"11px" }}><span style={{ color:T.textTer }}>{k}</span><span style={{ color:T.text,fontWeight:500,fontFamily:"monospace" }}>{v}</span></div>))}</div>
    </div>
  </div>
);

const Embeds = () => {
  const [copied,setCopied] = useState(false);
  const code = `<iframe\n  src="https://visumed.edu/embed/abc123"\n  width="800" height="600"\n  frameborder="0"\n  allow="fullscreen"\n  title="TC Tórax — Anatomía II">\n</iframe>`;
  return (
    <div style={{ animation:"fadeIn 0.3s ease",display:"grid",gridTemplateColumns:"1fr 360px",gap:20 }}>
      <div>
        <Card style={{ marginBottom:16 }}>
          <div style={{ fontSize:"14px",fontWeight:700,color:T.text,marginBottom:16 }}>Crear Visor</div>
          <label style={{ fontSize:"11px",fontWeight:600,color:T.textSec,display:"block",marginBottom:4 }}>¿Qué quieres publicar?</label>
          <select style={{ width:"100%",padding:"8px 10px",borderRadius:T.radiusSm,border:`1px solid ${T.border}`,fontSize:"13px",marginBottom:14,color:T.text,background:"#fff" }}><option>Imagen individual</option><option>Colección completa</option><option>Asignatura completa</option></select>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:16 }}>
            {[["Toolbar navegación",true],["Permitir zoom",true],["Info del caso",true],["Metadata DICOM",false],["Pantalla completa",false],["Modo oscuro",true]].map(([l,ch],i)=><label key={i} style={{ display:"flex",alignItems:"center",gap:6,fontSize:"12px",color:T.textSec,cursor:"pointer" }}><input type="checkbox" defaultChecked={ch} style={{ accentColor:T.accent }}/>{l}</label>)}
          </div>
        </Card>
        <Card>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
            <div style={{ fontSize:"13px",fontWeight:700,color:T.text }}>Código del visor</div>
            <Btn small onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)}}>{copied?<>{I.Check(T.green,12)} ¡Copiado!</>:<>{I.Copy()} Copiar</>}</Btn>
          </div>
          <pre style={{ background:"#0a2540",color:"#e2e8f0",padding:16,borderRadius:T.radius,fontSize:"11px",fontFamily:"SFMono-Regular,Consolas,monospace",lineHeight:1.7,overflow:"auto",margin:0 }}>{code}</pre>
        </Card>
      </div>
      <div>
        <Card style={{ marginBottom:16 }}>
          <div style={{ fontSize:"13px",fontWeight:700,color:T.text,marginBottom:12 }}>Preview</div>
          <div style={{ borderRadius:"8px",overflow:"hidden",border:`1px solid ${T.border}` }}>
            <div style={{ background:"#f0f0f0",padding:"6px 10px",display:"flex",alignItems:"center",gap:6 }}>
              <div style={{ display:"flex",gap:4 }}><span style={{ width:8,height:8,borderRadius:"50%",background:"#e25950" }}/><span style={{ width:8,height:8,borderRadius:"50%",background:"#f5a623" }}/><span style={{ width:8,height:8,borderRadius:"50%",background:"#30b566" }}/></div>
              <div style={{ flex:1,background:"#fff",borderRadius:"3px",padding:"2px 8px",fontSize:"9px",color:T.textTer }}>campus.continental.edu.pe/aula</div>
            </div>
            <div style={{ height:160,background:"linear-gradient(135deg,#1a1a2e,#16213e)",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <div style={{ textAlign:"center" }}><div style={{ width:36,height:36,borderRadius:"50%",background:"radial-gradient(#3a3f55,#252838)",margin:"0 auto 8px" }}/><div style={{ fontSize:"9px",color:"rgba(255,255,255,0.5)" }}>TC Tórax — Derrame Pleural</div></div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ fontSize:"13px",fontWeight:700,color:T.text,marginBottom:12 }}>Visores Activos</div>
          {mockEmbeds.map((e,i)=>(<div key={i} style={{ padding:"10px 0",borderBottom:i<mockEmbeds.length-1?`1px solid ${T.borderLight}`:"none",opacity:e.status==="expired"?0.5:1 }}><div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}><span style={{ fontSize:"12px",fontWeight:600,color:T.text }}>{e.content}</span><StatusDot status={e.status}/></div><div style={{ fontSize:"10px",color:T.textTer }}>{e.domain} · {e.views} vistas</div></div>))}
        </Card>
      </div>
    </div>
  );
};

const Cors = () => (
  <div style={{ animation:"fadeIn 0.3s ease" }}>
    <Card style={{ marginBottom:20,background:"rgba(0,115,230,0.04)",border:`1px solid rgba(0,115,230,0.15)` }}>
      <div style={{ display:"flex",gap:12,alignItems:"flex-start" }}>{I.Info(T.blue)}<div><div style={{ fontSize:"13px",fontWeight:600,color:T.text,marginBottom:4 }}>¿Qué son los dominios CORS?</div><div style={{ fontSize:"12px",color:T.textSec,lineHeight:1.6 }}>Los dominios CORS determinan qué sitios web pueden mostrar tus imágenes embebidas. Agrega aquí los dominios de tu campus virtual para que los visores funcionen.</div></div></div>
    </Card>
    <div style={{ display:"grid",gridTemplateColumns:"1fr 320px",gap:20 }}>
      <Card>
        <div style={{ fontSize:"14px",fontWeight:700,color:T.text,marginBottom:16 }}>Dominios Permitidos</div>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead><tr>{["Dominio","Descripción","Embeds","Estado",""].map(h=><th key={h} style={{ textAlign:"left",padding:"8px 10px",fontSize:"10px",fontWeight:700,color:T.textTer,letterSpacing:"0.06em",textTransform:"uppercase",borderBottom:`1px solid ${T.border}` }}>{h}</th>)}</tr></thead>
          <tbody>{mockCors.map((d,i)=><tr key={i} style={{ borderBottom:`1px solid ${T.borderLight}` }}><td style={{ padding:"12px 10px",fontSize:"13px",fontWeight:600,color:T.text,fontFamily:"monospace" }}>{d.domain}</td><td style={{ padding:"12px 10px",fontSize:"12px",color:T.textSec }}>{d.desc}</td><td style={{ padding:"12px 10px",fontSize:"12px",fontWeight:600,color:T.accent }}>{d.embeds}</td><td style={{ padding:"12px 10px" }}><StatusDot status={d.status}/></td><td style={{ padding:"12px 10px" }}><button style={{ background:"none",border:"none",cursor:"pointer",display:"flex" }}>{I.Trash(T.red)}</button></td></tr>)}</tbody>
        </table>
      </Card>
      <div>
        <Card style={{ marginBottom:16 }}>
          <div style={{ fontSize:"13px",fontWeight:700,color:T.text,marginBottom:14 }}>Agregar Dominio</div>
          <div style={{ display:"flex",gap:0,marginBottom:10 }}><span style={{ padding:"8px 10px",background:T.bg,border:`1px solid ${T.border}`,borderRight:"none",borderRadius:`${T.radiusSm} 0 0 ${T.radiusSm}`,fontSize:"12px",color:T.textTer }}>https://</span><input placeholder="campus.universidad.edu" style={{ flex:1,padding:"8px 10px",border:`1px solid ${T.border}`,borderRadius:`0 ${T.radiusSm} ${T.radiusSm} 0`,fontSize:"12px",outline:"none",color:T.text }}/></div>
          <Btn primary style={{ width:"100%",justifyContent:"center" }}>{I.Plus("#fff")} Agregar Dominio</Btn>
        </Card>
        <Card>
          <div style={{ fontSize:"13px",fontWeight:700,color:T.text,marginBottom:14 }}>Verificar Dominio</div>
          <div style={{ display:"flex",gap:6,marginBottom:10 }}><input placeholder="dominio.com" style={{ flex:1,padding:"8px 10px",borderRadius:T.radiusSm,border:`1px solid ${T.border}`,fontSize:"12px",outline:"none",color:T.text }}/><Btn small>Verificar</Btn></div>
          <div style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 10px",background:T.greenSoft,borderRadius:T.radiusSm,fontSize:"11px",color:T.green }}>{I.Check(T.green,12)} Este dominio tiene acceso</div>
        </Card>
      </div>
    </div>
  </div>
);

const Courses = () => (
  <div style={{ animation:"fadeIn 0.3s ease" }}>
    <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:20 }}><Btn primary small>{I.Plus("#fff")} Nueva Asignatura</Btn></div>
    <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16 }}>
      {mockCourses.map((c,i)=>(
        <Card key={i} noPad style={{ overflow:"hidden",cursor:"pointer" }}>
          <div style={{ height:5,background:c.color }}/>
          <div style={{ padding:"18px 20px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}><div style={{ width:36,height:36,borderRadius:"8px",background:c.color+"12",display:"flex",alignItems:"center",justifyContent:"center" }}>{I.Book(c.color)}</div><div><div style={{ fontSize:"15px",fontWeight:700,color:T.text }}>{c.name}</div><div style={{ fontSize:"11px",color:T.textTer }}>Semestre {c.semester}</div></div></div>
            <div style={{ display:"flex",gap:16,fontSize:"12px",color:T.textSec }}><span><strong style={{ color:T.text }}>{c.images}</strong> imgs</span><span><strong style={{ color:T.text }}>{c.collections}</strong> colecciones</span><span><strong style={{ color:T.text }}>{c.embeds}</strong> visores</span></div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   SYSTEM LAYOUT
   ═══════════════════════════════════════════ */
const SystemLayout = ({ onLogout }) => {
  const [page,setPage] = useState("dashboard");
  const [collapsed,setCollapsed] = useState(false);
  const pages = { dashboard:<Dashboard setPage={setPage}/>, upload:<UploadPage/>, library:<Library setPage={setPage}/>, viewer:<Viewer/>, courses:<Courses/>, collections:<Courses/>, embeds:<Embeds/>, cors:<Cors/> };
  return (
    <div style={{ display:"flex",height:"100vh",background:T.bg,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif",overflow:"hidden",animation:"slideInSystem 0.4s ease forwards" }}>
      <Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} onLogout={onLogout}/>
      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
        <Header page={page}/>
        <main style={{ flex:1,overflow:"auto",padding:"24px 28px" }}>{pages[page]||pages.dashboard}</main>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   APP ROOT — Auth Router
   ═══════════════════════════════════════════ */
export default function VisuMedApp() {
  const [auth, setAuth] = useState(false);

  return (
    <>
      <GlobalStyles />
      {auth
        ? <SystemLayout onLogout={() => setAuth(false)} />
        : <LoginScreen onLogin={() => setAuth(true)} />
      }
    </>
  );
}
