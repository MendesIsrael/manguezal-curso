import { Link } from 'react-router-dom';

function AdminDashboard() {
    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Dashboard Administrativo</h1>
                    <p>Gerencie o conteúdo e acompanhe o progresso dos alunos</p>
                </div>
                <div className="topbar-actions">
                    <button className="topbar-btn">🔔</button>
                    <button className="topbar-btn">⚙️</button>
                </div>
            </header>

            <div className="page-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon primary">🎬</div>
                        <div className="stat-info">
                            <h3>0</h3>
                            <p>Vídeos Cadastrados</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon secondary">🖼️</div>
                        <div className="stat-info">
                            <h3>0</h3>
                            <p>Imagens Cadastradas</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon accent">📄</div>
                        <div className="stat-info">
                            <h3>0</h3>
                            <p>PDFs Cadastrados</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon success">👥</div>
                        <div className="stat-info">
                            <h3>0</h3>
                            <p>Alunos Ativos</p>
                        </div>
                    </div>
                </div>

                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Ações Rápidas</h2>

                <div className="action-cards-grid">
                    <Link to="/admin/videos" className="action-card">
                        <div className="action-card-icon" style={{ background: 'rgba(45, 90, 39, 0.15)', color: 'var(--color-primary)' }}>
                            🎬
                        </div>
                        <h3>Upload de Vídeos</h3>
                        <p>Adicione novos vídeos ao curso</p>
                    </Link>

                    <Link to="/admin/imagens" className="action-card">
                        <div className="action-card-icon" style={{ background: 'rgba(139, 69, 19, 0.15)', color: 'var(--color-secondary)' }}>
                            🖼️
                        </div>
                        <h3>Upload de Imagens</h3>
                        <p>Adicione imagens ilustrativas</p>
                    </Link>

                    <Link to="/admin/pdfs" className="action-card">
                        <div className="action-card-icon" style={{ background: 'rgba(74, 144, 164, 0.15)', color: 'var(--color-accent)' }}>
                            📄
                        </div>
                        <h3>Upload de PDFs</h3>
                        <p>Adicione materiais didáticos</p>
                    </Link>

                    <Link to="/admin/exercicios" className="action-card">
                        <div className="action-card-icon" style={{ background: 'rgba(40, 167, 69, 0.15)', color: 'var(--color-success)' }}>
                            ✍️
                        </div>
                        <h3>Criar Exercícios</h3>
                        <p>Crie avaliações para os alunos</p>
                    </Link>

                    <Link to="/admin/relatorios" className="action-card">
                        <div className="action-card-icon" style={{ background: 'rgba(23, 162, 184, 0.15)', color: 'var(--color-info)' }}>
                            📋
                        </div>
                        <h3>Relatórios</h3>
                        <p>Visualize dados dos alunos</p>
                    </Link>

                    <Link to="/admin/estatisticas" className="action-card">
                        <div className="action-card-icon" style={{ background: 'rgba(255, 193, 7, 0.15)', color: '#d39e00' }}>
                            📈
                        </div>
                        <h3>Estatísticas</h3>
                        <p>Acompanhe o desempenho geral</p>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;
