import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

function StudentLayout() {
    const { user, logout } = useAuth();
    const { getUnreadNotifications, getStudentCertificates } = useData();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const unreadNotifications = getUnreadNotifications(user?.id) || [];
    const certificates = getStudentCertificates(user?.id) || [];

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">🌿</div>
                    <span className="sidebar-logo-text">Manguezal</span>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Principal</div>
                        <NavLink to="/aluno" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">🏠</span>
                            <span>Início</span>
                        </NavLink>
                        <NavLink to="/aluno/cursos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">📚</span>
                            <span>Meus Cursos</span>
                        </NavLink>
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Conteúdo</div>
                        <NavLink to="/aluno/videos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">🎬</span>
                            <span>Vídeos</span>
                        </NavLink>
                        <NavLink to="/aluno/imagens" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">🖼️</span>
                            <span>Imagens</span>
                        </NavLink>
                        <NavLink to="/aluno/pdfs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">📄</span>
                            <span>PDFs</span>
                        </NavLink>
                        <NavLink to="/aluno/exercicios" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">✍️</span>
                            <span>Exercícios</span>
                        </NavLink>
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Meu Progresso</div>
                        <NavLink to="/aluno/resultados" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">📊</span>
                            <span>Meus Resultados</span>
                        </NavLink>
                        <NavLink to="/aluno/certificado" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">🎓</span>
                            <span>Certificado</span>
                            {certificates.length > 0 && (
                                <span className="sidebar-badge success">{certificates.length}</span>
                            )}
                        </NavLink>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{user?.name || 'Aluno'}</div>
                            <div className="sidebar-user-role">Estudante</div>
                        </div>
                    </div>
                    <button className="sidebar-link" onClick={handleLogout} style={{ marginTop: '1rem', width: '100%' }}>
                        <span className="icon">🚪</span>
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default StudentLayout;
