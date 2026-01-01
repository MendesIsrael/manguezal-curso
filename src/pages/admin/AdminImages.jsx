function AdminImages() {
    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Gerenciar Imagens</h1>
                    <p>Faça upload e gerencie as imagens do curso</p>
                </div>
                <div className="topbar-actions">
                    <button className="btn btn-primary">+ Nova Imagem</button>
                </div>
            </header>

            <div className="page-content">
                <div className="content-card">
                    <div className="content-card-header">
                        <h2>Upload de Imagens</h2>
                    </div>
                    <div className="content-card-body">
                        <div className="upload-zone">
                            <div className="upload-zone-icon">🖼️</div>
                            <h3>Arraste e solte suas imagens aqui</h3>
                            <p>ou clique para selecionar arquivos</p>
                            <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                Formatos aceitos: JPG, PNG, WebP, GIF (máx. 10MB cada)
                            </p>
                        </div>

                        <div className="form-section" style={{ marginTop: '2rem' }}>
                            <div className="form-group">
                                <label>Título da Imagem</label>
                                <input type="text" className="form-input" placeholder="Digite o título da imagem" />
                            </div>
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label>Legenda</label>
                                <textarea className="form-textarea" placeholder="Digite uma legenda para a imagem"></textarea>
                            </div>
                            <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Salvar Imagem</button>
                        </div>
                    </div>
                </div>

                <div className="content-card" style={{ marginTop: '2rem' }}>
                    <div className="content-card-header">
                        <h2>Galeria de Imagens</h2>
                    </div>
                    <div className="content-card-body">
                        <div className="empty-state">
                            <div className="empty-state-icon">🖼️</div>
                            <h3>Nenhuma imagem cadastrada</h3>
                            <p>Faça upload da primeira imagem acima</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminImages;
