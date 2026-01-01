function StudentVideos() {
    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Vídeos do Curso</h1>
                    <p>Assista às aulas em vídeo sobre o manguezal</p>
                </div>
            </header>

            <div className="page-content">
                <div className="content-card">
                    <div className="content-card-header">
                        <h2>Vídeos Disponíveis</h2>
                    </div>
                    <div className="content-card-body">
                        <div className="empty-state">
                            <div className="empty-state-icon">🎬</div>
                            <h3>Nenhum vídeo disponível</h3>
                            <p>Os vídeos serão adicionados pelo administrador em breve</p>
                        </div>

                        {/* Estrutura para quando houver vídeos */}
                        {/* 
            <div className="video-grid">
              <div className="video-card">
                <div className="video-thumbnail">
                  ▶️
                  <span className="video-duration">10:30</span>
                </div>
                <div className="video-card-content">
                  <h4>Título do Vídeo</h4>
                  <p>Descrição breve do vídeo...</p>
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

export default StudentVideos;
