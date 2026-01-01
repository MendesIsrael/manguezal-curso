import { useState } from 'react';

function AdminReports() {
    const [reportType, setReportType] = useState('general');

    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Relatórios</h1>
                    <p>Visualize relatórios de desempenho dos alunos</p>
                </div>
                <div className="topbar-actions">
                    <button className="btn btn-primary">📥 Exportar</button>
                </div>
            </header>

            <div className="page-content">
                <div className="tabs" style={{ marginBottom: '2rem' }}>
                    <button
                        className={`tab ${reportType === 'general' ? 'active' : ''}`}
                        onClick={() => setReportType('general')}
                    >
                        Relatório Geral
                    </button>
                    <button
                        className={`tab ${reportType === 'individual' ? 'active' : ''}`}
                        onClick={() => setReportType('individual')}
                    >
                        Relatório Individual
                    </button>
                    <button
                        className={`tab ${reportType === 'exercises' ? 'active' : ''}`}
                        onClick={() => setReportType('exercises')}
                    >
                        Por Exercício
                    </button>
                </div>

                {reportType === 'general' && (
                    <div className="content-card">
                        <div className="content-card-header">
                            <h2>Visão Geral do Curso</h2>
                        </div>
                        <div className="content-card-body">
                            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                                <div className="stat-card">
                                    <div className="stat-icon primary">👥</div>
                                    <div className="stat-info">
                                        <h3>0</h3>
                                        <p>Total de Alunos</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon success">✅</div>
                                    <div className="stat-info">
                                        <h3>0%</h3>
                                        <p>Taxa de Conclusão</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon accent">📊</div>
                                    <div className="stat-info">
                                        <h3>0</h3>
                                        <p>Média de Acertos</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon secondary">⏱️</div>
                                    <div className="stat-info">
                                        <h3>0h</h3>
                                        <p>Tempo Médio</p>
                                    </div>
                                </div>
                            </div>

                            <div className="empty-state">
                                <div className="empty-state-icon">📋</div>
                                <h3>Sem dados disponíveis</h3>
                                <p>Os dados aparecerão quando alunos começarem a usar a plataforma</p>
                            </div>
                        </div>
                    </div>
                )}

                {reportType === 'individual' && (
                    <div className="content-card">
                        <div className="content-card-header">
                            <h2>Relatório por Aluno</h2>
                        </div>
                        <div className="content-card-body">
                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label>Selecione um Aluno</label>
                                <select className="form-input">
                                    <option value="">-- Selecione --</option>
                                </select>
                            </div>

                            <div className="empty-state">
                                <div className="empty-state-icon">👤</div>
                                <h3>Selecione um aluno</h3>
                                <p>Escolha um aluno acima para visualizar seu relatório individual</p>
                            </div>
                        </div>
                    </div>
                )}

                {reportType === 'exercises' && (
                    <div className="content-card">
                        <div className="content-card-header">
                            <h2>Desempenho por Exercício</h2>
                        </div>
                        <div className="content-card-body">
                            <div className="empty-state">
                                <div className="empty-state-icon">✍️</div>
                                <h3>Nenhum exercício encontrado</h3>
                                <p>Crie exercícios para ver o desempenho dos alunos</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminReports;
