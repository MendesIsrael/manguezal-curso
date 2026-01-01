function AdminPdfs() {
    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Gerenciar PDFs</h1>
                    <p>Faça upload e gerencie os materiais didáticos</p>
                </div>
                <div className="topbar-actions">
                    <button className="btn btn-primary">+ Novo PDF</button>
                </div>
            </header>

            <div className="page-content">
                <div className="content-card">
                    <div className="content-card-header">
                        <h2>Upload de PDF</h2>
                    </div>
                    <div className="content-card-body">
                        <div className="upload-zone">
                            <div className="upload-zone-icon">📄</div>
                            <h3>Arraste e solte seu PDF aqui</h3>
                            <p>ou clique para selecionar um arquivo</p>
                            <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                Formato aceito: PDF (máx. 50MB)
                            </p>
                        </div>

                        <div className="form-section" style={{ marginTop: '2rem' }}>
                            <div className="form-group">
                                <label>Título do Material</label>
                                <input type="text" className="form-input" placeholder="Digite o título do material" />
                            </div>
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label>Descrição</label>
                                <textarea className="form-textarea" placeholder="Digite uma descrição para o material"></textarea>
                            </div>
                            <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Salvar PDF</button>
                        </div>
                    </div>
                </div>

                <div className="content-card" style={{ marginTop: '2rem' }}>
                    <div className="content-card-header">
                        <h2>PDFs Cadastrados</h2>
                    </div>
                    <div className="content-card-body">
                        <div className="empty-state">
                            <div className="empty-state-icon">📄</div>
                            <h3>Nenhum PDF cadastrado</h3>
                            <p>Faça upload do primeiro material acima</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminPdfs;
