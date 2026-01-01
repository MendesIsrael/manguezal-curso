function StudentPdfs() {
    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Materiais em PDF</h1>
                    <p>Leia e baixe os materiais didáticos do curso</p>
                </div>
            </header>

            <div className="page-content">
                <div className="content-card">
                    <div className="content-card-header">
                        <h2>PDFs Disponíveis</h2>
                    </div>
                    <div className="content-card-body">
                        <div className="empty-state">
                            <div className="empty-state-icon">📄</div>
                            <h3>Nenhum PDF disponível</h3>
                            <p>Os materiais serão adicionados pelo administrador em breve</p>
                        </div>

                        {/* Estrutura para quando houver PDFs */}
                        {/*
            <div className="pdf-list">
              <div className="pdf-item">
                <div className="pdf-icon">📄</div>
                <div className="pdf-info">
                  <h4>Nome do Material</h4>
                  <p>Descrição do material • 2.5 MB</p>
                </div>
                <div className="pdf-actions">
                  <button className="btn-icon view" title="Visualizar">👁️</button>
                  <button className="btn-icon download" title="Baixar">⬇️</button>
                </div>
              </div>
            </div>
            */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default StudentPdfs;
