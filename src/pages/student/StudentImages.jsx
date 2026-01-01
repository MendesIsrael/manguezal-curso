function StudentImages() {
    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Galeria de Imagens</h1>
                    <p>Explore as imagens do ecossistema manguezal</p>
                </div>
            </header>

            <div className="page-content">
                <div className="content-card">
                    <div className="content-card-header">
                        <h2>Imagens Disponíveis</h2>
                    </div>
                    <div className="content-card-body">
                        <div className="empty-state">
                            <div className="empty-state-icon">🖼️</div>
                            <h3>Nenhuma imagem disponível</h3>
                            <p>As imagens serão adicionadas pelo administrador em breve</p>
                        </div>

                        {/* Estrutura para quando houver imagens */}
                        {/*
            <div className="image-gallery">
              <div className="gallery-item">
                <div className="gallery-item-placeholder">
                  <span className="icon">🖼️</span>
                  <span>Imagem</span>
                </div>
                <div className="gallery-overlay">
                  <span className="gallery-overlay-icon">🔍</span>
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

export default StudentImages;
