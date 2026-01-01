import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import './styles/index.css';
import './styles/login.css';
import './styles/dashboard.css';
import './styles/components.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSetup from './pages/admin/AdminSetup';
import AdminCourses from './pages/admin/AdminCourses';
import AdminModules from './pages/admin/AdminModules';
import AdminVideos from './pages/admin/AdminVideos';
import AdminImages from './pages/admin/AdminImages';
import AdminPdfs from './pages/admin/AdminPdfs';
import AdminExercises from './pages/admin/AdminExercises';
import AdminComments from './pages/admin/AdminComments';
import AdminReports from './pages/admin/AdminReports';
import AdminStatistics from './pages/admin/AdminStatistics';

// Student Pages
import StudentLayout from './components/layouts/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentCourseView from './pages/student/StudentCourseView';
import StudentVideos from './pages/student/StudentVideos';
import StudentImages from './pages/student/StudentImages';
import StudentPdfs from './pages/student/StudentPdfs';
import StudentExercises from './pages/student/StudentExercises';
import StudentResults from './pages/student/StudentResults';
import StudentCertificate from './pages/student/StudentCertificate';

// Protected Route Component
function ProtectedRoute({ children, allowedType }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--bg-primary)'
      }}>
        <div className="loading-spinner">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedType && user?.type !== allowedType) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedType="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="setup" element={<AdminSetup />} />
        <Route path="cursos" element={<AdminCourses />} />
        <Route path="modulos" element={<AdminModules />} />
        <Route path="videos" element={<AdminVideos />} />
        <Route path="imagens" element={<AdminImages />} />
        <Route path="pdfs" element={<AdminPdfs />} />
        <Route path="exercicios" element={<AdminExercises />} />
        <Route path="comentarios" element={<AdminComments />} />
        <Route path="relatorios" element={<AdminReports />} />
        <Route path="estatisticas" element={<AdminStatistics />} />
      </Route>

      {/* Student Routes */}
      <Route
        path="/aluno"
        element={
          <ProtectedRoute allowedType="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="cursos" element={<StudentCourses />} />
        <Route path="curso/:courseId" element={<StudentCourseView />} />
        <Route path="videos" element={<StudentVideos />} />
        <Route path="imagens" element={<StudentImages />} />
        <Route path="pdfs" element={<StudentPdfs />} />
        <Route path="exercicios" element={<StudentExercises />} />
        <Route path="resultados" element={<StudentResults />} />
        <Route path="certificado" element={<StudentCertificate />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
