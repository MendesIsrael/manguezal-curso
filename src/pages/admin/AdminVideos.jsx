import { useState } from 'react';
import { useData } from '../../contexts/DataContext';

function AdminVideos() {
    const { courses, modules, videos, addVideo, deleteVideo, getModulesByCourse } = useData();
    const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
    const [selectedModuleId, setSelectedModuleId] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        duration: 10
    });

    const courseModules = selectedCourseId ? getModulesByCourse(selectedCourseId) : [];
    const moduleVideos = selectedModuleId
        ? videos.filter(v => v.moduleId === selectedModuleId)
        : [];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedModuleId) {
            alert('Selecione um módulo');
            return;
        }

        addVideo({
            ...formData,
            courseId: selectedCourseId,
            moduleId: selectedModuleId,
            order: moduleVideos.length + 1
        });

        setFormData({
            title: '',
            description: '',
            url: '',
            duration: 10
        });
    };

    const handleDelete = (videoId) => {
        if (confirm('Tem certeza que deseja excluir este vídeo?')) {
            deleteVideo(videoId);
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    };

    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Gerenciar Vídeos</h1>
                    <p>Faça upload e gerencie os vídeos do curso</p>
                </div>
            </header>

            <div className="page-content">
                {/* Course and Module Selector */}
                <div className="content-card" style={{ marginBottom: '2rem' }}>
                    <div className="content-card-body">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Selecione o Curso</label>
                                <select
                                    className="form-input"
                                    value={selectedCourseId}
                                    onChange={e => {
                                        setSelectedCourseId(e.target.value);
                                        setSelectedModuleId('');
                                    }}
                                >
                                    <option value="">-- Selecione um curso --</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Selecione o Módulo</label>
                                <select
                                    className="form-input"
                                    value={selectedModuleId}
                                    onChange={e => setSelectedModuleId(e.target.value)}
                                    disabled={!selectedCourseId}
                                >
                                    <option value="">-- Selecione um módulo --</option>
                                    {courseModules.map(module => (
                                        <option key={module.id} value={module.id}>
                                            {module.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upload Form */}
                <div className="content-card">
                    <div className="content-card-header">
                        <h2>Adicionar Vídeo</h2>
                    </div>
                    <div className="content-card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>URL do Vídeo (YouTube)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                    required
                                />
                                <small style={{ color: 'var(--text-light)', fontSize: 'var(--font-xs)' }}>
                                    Cole a URL do YouTube ou Vimeo
                                </small>
                            </div>
                            <div className="form-row" style={{ marginTop: '1rem' }}>
                                <div className="form-group">
                                    <label>Título do Vídeo</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Digite o título do vídeo"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Duração (minutos)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label>Descrição</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Digite uma descrição para o vídeo"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ marginTop: '1rem' }}
                                disabled={!selectedModuleId}
                            >
                                Salvar Vídeo
                            </button>
                        </form>
                    </div>
                </div>

                {/* Videos List */}
                <div className="content-card" style={{ marginTop: '2rem' }}>
                    <div className="content-card-header">
                        <h2>Vídeos Cadastrados {selectedModuleId && `(${moduleVideos.length})`}</h2>
                    </div>
                    <div className="content-card-body">
                        {!selectedModuleId ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📋</div>
                                <h3>Selecione um módulo</h3>
                                <p>Escolha um curso e módulo acima para ver os vídeos</p>
                            </div>
                        ) : moduleVideos.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">🎬</div>
                                <h3>Nenhum vídeo cadastrado</h3>
                                <p>Adicione o primeiro vídeo neste módulo</p>
                            </div>
                        ) : (
                            <div className="video-grid">
                                {moduleVideos.map(video => (
                                    <div key={video.id} className="video-card">
                                        <div className="video-thumbnail">
                                            🎬
                                            <span className="video-duration">{video.duration} min</span>
                                        </div>
                                        <div className="video-card-content">
                                            <h4>{video.title}</h4>
                                            <p>{video.description}</p>
                                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className="btn btn-danger btn-small"
                                                    onClick={() => handleDelete(video.id)}
                                                >
                                                    🗑️ Excluir
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminVideos;
