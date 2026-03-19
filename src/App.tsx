import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/guards/ProtectedRoute';
import { GuestRoute } from '@/guards/GuestRoute';
import { SystemLayout } from '@/layouts/SystemLayout/SystemLayout';
import { LoginPage } from '@/pages/Login/LoginPage';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { UploadPage } from '@/pages/Upload/UploadPage';
import { LibraryPage } from '@/pages/Library/LibraryPage';
import { ViewerPage } from '@/pages/Viewer/ViewerPage';
import { PeriodsPage } from '@/pages/Periods/PeriodsPage';
import { CoursesPage } from '@/pages/Courses/CoursesPage';
import { CourseDetailPage } from '@/pages/Courses/CourseDetailPage';
// import { CollectionsPage } from '@/pages/Collections/CollectionsPage';
// import { CollectionDetailPage } from '@/pages/Collections/CollectionDetailPage';
import { EmbedsPage } from '@/pages/Embeds/EmbedsPage';
import { CorsPage } from '@/pages/Cors/CorsPage';
import { SharedViewerPage } from '@/pages/SharedViewer/SharedViewerPage';
import { TestEmbedPage } from '@/pages/TestEmbed/TestEmbedPage';

const App = () => (
  <Routes>
    {/* Visor compartido (público, sin autenticación) */}
    <Route path="/shared/:token" element={<SharedViewerPage />} />

    {/* Página de prueba para embeds (solo dev) */}
    <Route path="/prueba" element={<TestEmbedPage />} />

    {/* Rutas públicas */}
    <Route element={<GuestRoute />}>
      <Route path="/login" element={<LoginPage />} />
    </Route>

    {/* Rutas protegidas con layout */}
    <Route element={<ProtectedRoute />}>
      <Route element={<SystemLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/viewer" element={<ViewerPage />} />
        <Route path="/viewer/:studyId" element={<ViewerPage />} />
        <Route path="/periods" element={<PeriodsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        {/* <Route path="/collections" element={<CollectionsPage />} /> */}
        {/* <Route path="/collections/:collectionId" element={<CollectionDetailPage />} /> */}
        <Route path="/embeds" element={<EmbedsPage />} />
        <Route path="/cors" element={<CorsPage />} />
      </Route>
    </Route>

    {/* Redirect raíz */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default App;
