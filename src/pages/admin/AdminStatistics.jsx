function AdminStatistics() {
    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Estatísticas</h1>
                    <p>Acompanhe as métricas e desempenho do curso</p>
                </div>
                <div className="topbar-actions">
                    <select className="form-input" style={{ width: 'auto' }}>
                        <option value="7">Últimos 7 dias</option>
                        <option value="30">Últimos 30 dias</option>
                        <option value="90">Últimos 90 dias</option>
                        <option value="all">Todo período</option>
                    </select>
                </div>
            </header>

            <div className="page-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon primary">📈</div>
                        <div className="stat-info">
                            <h3>0</h3>
                            <p>Acessos Totais</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon accent">🎬</div>
                        <div className="stat-info">
                            <h3>0</h3>
                            <p>Vídeos Assistidos</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon secondary">📄</div>
                        <div className="stat-info">
                            <h3>0</h3>
                            <p>PDFs Baixados</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon success">✅</div>
                        <div className="stat-info">
                            <h3>0</h3>
                            <p>Exercícios Concluídos</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                    <div className="content-card">
                        <div className="content-card-header">
                            <h2>Acessos por Dia</h2>
                        </div>
                        <div className="content-card-body">
                            <div className="chart-placeholder">
                                <div className="icon">📊</div>
                                <p>Gráfico de acessos diários</p>
                            </div>
                        </div>
                    </div>

                    <div className="content-card">
                        <div className="content-card-header">
                            <h2>Desempenho em Exercícios</h2>
                        </div>
                        <div className="content-card-body">
                            <div className="chart-placeholder">
                                <div className="icon">📈</div>
                                <p>Gráfico de desempenho</p>
                            </div>
                        </div>
                    </div>

                    <div className="content-card">
                        <div className="content-card-header">
                            <h2>Conteúdos Mais Acessados</h2>
                        </div>
                        <div className="content-card-body">
                            <div className="chart-placeholder">
                                <div className="icon">🏆</div>
                                <p>Ranking de conteúdos</p>
                            </div>
                        </div>
                    </div>

                    <div className="content-card">
                        <div className="content-card-header">
                            <h2>Progresso dos Alunos</h2>
                        </div>
                        <div className="content-card-body">
                            <div className="chart-placeholder">
                                <div className="icon">👥</div>
                                <p>Distribuição de progresso</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminStatistics;
