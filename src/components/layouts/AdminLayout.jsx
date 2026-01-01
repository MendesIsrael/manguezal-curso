import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

function AdminLayout() {
    const { user, logout } = useAuth();
    const { comments } = useData();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Count unresolved comments
    const unresolvedCount = comments.filter(c => !c.parentId && !c.isResolved).length;

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
                        <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">📊</span>
                            <span>Dashboard</span>
                        </NavLink>
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Gestão</div>
                        <NavLink to="/admin/cursos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">📚</span>
                            <span>Cursos</span>
                        </NavLink>
                        <NavLink to="/admin/modulos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">📦</span>
                            <span>Módulos</span>
                        </NavLink>
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Conteúdo</div>
                        <NavLink to="/admin/videos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">🎬</span>
                            <span>Vídeos</span>
                        </NavLink>
                        <NavLink to="/admin/imagens" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">🖼️</span>
                            <span>Imagens</span>
                        </NavLink>
                        <NavLink to="/admin/pdfs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">📄</span>
                            <span>PDFs</span>
                        </NavLink>
                        <NavLink to="/admin/exercicios" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">✍️</span>
                            <span>Exercícios</span>
                        </NavLink>
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Interação</div>
                        <NavLink to="/admin/comentarios" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">💬</span>
                            <span>Comentários</span>
                            {unresolvedCount > 0 && (
                                <span className="sidebar-badge">{unresolvedCount}</span>
                            )}
                        </NavLink>
                        <NavLink to="/admin/alunos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">👥</span>
                            <span>Alunos</span>
                        </NavLink>
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Análises</div>
                        <NavLink to="/admin/relatorios" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">📋</span>
                            <span>Relatórios</span>
                        </NavLink>
                        <NavLink to="/admin/estatisticas" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">📈</span>
                            <span>Estatísticas</span>
                        </NavLink>
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Configurações</div>
                        <NavLink to="/admin/setup" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="icon">⚙️</span>
                            <span>Configurações</span>
                        </NavLink>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{user?.name || 'Admin'}</div>
                            <div className="sidebar-user-role">Administrador</div>
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

export default AdminLayout;
