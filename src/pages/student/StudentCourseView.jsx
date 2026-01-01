import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import CommentSection from '../../components/Comments/CommentSection';

function StudentCourseView() {
    const { courseId } = useParams();
    const { user } = useAuth();
    const {
        courses,
        getModulesByCourse,
        getVideosByModule,
        getPdfsByModule,
        getExercisesByModule,
        getCourseProgress,
        markAsCompleted,
        progress
    } = useData();

    const course = courses.find(c => c.id === courseId);
    const modules = getModulesByCourse(courseId);
    const courseProgress = getCourseProgress(user.id, courseId);

    const [expandedModule, setExpandedModule] = useState(modules[0]?.id || null);
    const [selectedContent, setSelectedContent] = useState(null);
    const [showComments, setShowComments] = useState(false);

    if (!course) {
        return (
            <div className="page-content">
                <div className="empty-state">
                    <div className="empty-state-icon">❌</div>
                    <h3>Curso não encontrado</h3>
                    <Link to="/aluno/cursos" className="btn btn-primary">Voltar aos Cursos</Link>
                </div>
            </div>
        );
    }

    const isContentCompleted = (contentId) => {
        return progress.some(p => p.userId === user.id && p.contentId === contentId && p.completed);
    };

    const handleMarkComplete = (contentId) => {
        markAsCompleted(user.id, contentId);
    };

    const getContentIcon = (type) => {
        switch (type) {
            case 'video': return '🎬';
            case 'pdf': return '📄';
            case 'exercise': return '✍️';
            default: return '📋';
        }
    };

    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <Link to="/aluno/cursos" className="back-link">← Voltar</Link>
                    <h1>{course.title}</h1>
                    <p>{course.description}</p>
                </div>
                <div className="topbar-actions">
                    <div className="course-progress-badge">
                        <span className="progress-percentage">{courseProgress}%</span>
                        <span className="progress-label">concluído</span>
                    </div>
                </div>
            </header>

            <div className="page-content course-view-layout">
                {/* Sidebar with modules */}
                <div className="course-sidebar">
                    <div className="course-progress-bar">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${courseProgress}%` }}
                            />
                        </div>
                        <span>{courseProgress}% concluído</span>
                    </div>

                    <div className="modules-accordion">
                        {modules.map((module, index) => {
                            const videos = getVideosByModule(module.id);
                            const pdfs = getPdfsByModule(module.id);
                            const exercises = getExercisesByModule(module.id);
                            const isExpanded = expandedModule === module.id;

                            return (
                                <div key={module.id} className="module-accordion-item">
                                    <button
                                        className={`module-accordion-header ${isExpanded ? 'expanded' : ''}`}
                                        onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                                    >
                                        <span className="module-number">Módulo {index + 1}</span>
                                        <span className="module-title">{module.title}</span>
                                        <span className="module-toggle">{isExpanded ? '−' : '+'}</span>
                                    </button>

                                    {isExpanded && (
                                        <div className="module-accordion-content">
                                            {videos.map(video => (
                                                <button
                                                    key={video.id}
                                                    className={`content-item ${selectedContent?.id === video.id ? 'active' : ''} ${isContentCompleted(video.id) ? 'completed' : ''}`}
                                                    onClick={() => setSelectedContent({ ...video, type: 'video' })}
                                                >
                                                    <span className="content-icon">{getContentIcon('video')}</span>
                                                    <span className="content-title">{video.title}</span>
                                                    {isContentCompleted(video.id) && <span className="check-icon">✓</span>}
                                                </button>
                                            ))}
                                            {pdfs.map(pdf => (
                                                <button
                                                    key={pdf.id}
                                                    className={`content-item ${selectedContent?.id === pdf.id ? 'active' : ''} ${isContentCompleted(pdf.id) ? 'completed' : ''}`}
                                                    onClick={() => setSelectedContent({ ...pdf, type: 'pdf' })}
                                                >
                                                    <span className="content-icon">{getContentIcon('pdf')}</span>
                                                    <span className="content-title">{pdf.title}</span>
                                                    {isContentCompleted(pdf.id) && <span className="check-icon">✓</span>}
                                                </button>
                                            ))}
                                            {exercises.map(exercise => (
                                                <Link
                                                    key={exercise.id}
                                                    to={`/aluno/exercicios?id=${exercise.id}`}
                                                    className={`content-item ${isContentCompleted(exercise.id) ? 'completed' : ''}`}
                                                >
                                                    <span className="content-icon">{getContentIcon('exercise')}</span>
                                                    <span className="content-title">{exercise.title}</span>
                                                    {isContentCompleted(exercise.id) && <span className="check-icon">✓</span>}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main content area */}
                <div className="course-main-content">
                    {!selectedContent ? (
                        <div className="content-placeholder">
                            <div className="empty-state">
                                <div className="empty-state-icon">👈</div>
                                <h3>Selecione um conteúdo</h3>
                                <p>Escolha um vídeo, PDF ou exercício no menu lateral</p>
                            </div>
                        </div>
                    ) : selectedContent.type === 'video' ? (
                        <div className="video-content">
                            <div className="video-player">
                                <iframe
                                    src={selectedContent.url}
                                    title={selectedContent.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <div className="content-details">
                                <h2>{selectedContent.title}</h2>
                                <p>{selectedContent.description}</p>
                                <div className="content-actions">
                                    {!isContentCompleted(selectedContent.id) && (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleMarkComplete(selectedContent.id)}
                                        >
                                            ✓ Marcar como Concluído
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => setShowComments(!showComments)}
                                    >
                                        💬 {showComments ? 'Ocultar' : 'Mostrar'} Comentários
                                    </button>
                                </div>

                                {showComments && (
                                    <CommentSection
                                        contentId={selectedContent.id}
                                        contentType="video"
                                        courseId={courseId}
                                    />
                                )}
                            </div>
                        </div>
                    ) : selectedContent.type === 'pdf' ? (
                        <div className="pdf-content">
                            <div className="pdf-header">
                                <div className="pdf-icon">📄</div>
                                <div>
                                    <h2>{selectedContent.title}</h2>
                                    <p>{selectedContent.description}</p>
                                </div>
                            </div>
                            <div className="pdf-actions">
                                <button className="btn btn-primary">
                                    📥 Baixar PDF
                                </button>
                                {!isContentCompleted(selectedContent.id) && (
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => handleMarkComplete(selectedContent.id)}
                                    >
                                        ✓ Marcar como Lido
                                    </button>
                                )}
                            </div>

                            <div className="content-actions" style={{ marginTop: '2rem' }}>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => setShowComments(!showComments)}
                                >
                                    💬 {showComments ? 'Ocultar' : 'Mostrar'} Comentários
                                </button>
                            </div>

                            {showComments && (
                                <CommentSection
                                    contentId={selectedContent.id}
                                    contentType="pdf"
                                    courseId={courseId}
                                />
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}

export default StudentCourseView;
