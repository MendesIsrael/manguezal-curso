import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

function StudentDashboard() {
    const { user } = useAuth();
    const {
        enrollments,
        courses,
        videos,
        exercises,
        grades,
        progress,
        getStudentCertificates
    } = useData();

    // Calculate stats
    const studentEnrollments = enrollments.filter(e => e.userId === user.id);
    const enrolledCourseIds = studentEnrollments.map(e => e.courseId);

    const totalVideos = videos.filter(v => enrolledCourseIds.includes(v.courseId)).length;
    const watchedVideos = progress.filter(
        p => p.userId === user.id && p.contentType === 'video' && p.completed
    ).length;

    const totalExercises = exercises.filter(e => enrolledCourseIds.includes(e.courseId)).length;
    const completedExercises = grades.filter(g => g.userId === user.id).length;

    const studentGrades = grades.filter(g => g.userId === user.id);
    const averageGrade = studentGrades.length > 0
        ? Math.round(studentGrades.reduce((sum, g) => sum + g.percentage, 0) / studentGrades.length)
        : 0;

    const overallProgress = progress.filter(p => p.userId === user.id);
    const completedProgress = overallProgress.filter(p => p.completed).length;
    const progressPercentage = overallProgress.length > 0
        ? Math.round((completedProgress / overallProgress.length) * 100)
        : 0;

    const certificates = getStudentCertificates(user.id);

    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Olá, {user.name}!</h1>
                    <p>Continue seus estudos de onde parou</p>
                </div>
                <div className="topbar-actions">
                    {certificates.length > 0 && (
                        <Link to="/aluno/certificado" className="btn btn-success">
                            🎓 {certificates.length} Certificado(s)
                        </Link>
                    )}
                </div>
            </header>

            <div className="page-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon primary">📚</div>
                        <div className="stat-info">
                            <h3>{progressPercentage}%</h3>
                            <p>Progresso Geral</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon accent">🎬</div>
                        <div className="stat-info">
                            <h3>{watchedVideos}/{totalVideos}</h3>
                            <p>Vídeos Assistidos</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon secondary">✍️</div>
                        <div className="stat-info">
                            <h3>{completedExercises}/{totalExercises}</h3>
                            <p>Exercícios Feitos</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon success">🏆</div>
                        <div className="stat-info">
                            <h3>{averageGrade > 0 ? `${averageGrade}%` : '--'}</h3>
                            <p>Média de Acertos</p>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                {studentEnrollments.length > 0 && (
                    <div className="content-card" style={{ marginBottom: '2rem' }}>
                        <div className="content-card-body">
                            <div className="progress-section">
                                <div className="progress-header">
                                    <span>Seu progresso geral</span>
                                    <span>{progressPercentage}% concluído</span>
                                </div>
                                <div className="progress-bar" style={{ height: '12px' }}>
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                    {studentEnrollments.length > 0 ? 'Continuar Estudando' : 'Comece Agora'}
                </h2>

                <div className="action-cards-grid">
                    <Link to="/aluno/cursos" className="action-card">
                        <div className="action-card-icon" style={{ background: 'rgba(45, 90, 39, 0.15)', color: 'var(--color-primary)' }}>
                            📚
                        </div>
                        <h3>Meus Cursos</h3>
                        <p>Acesse seus cursos matriculados</p>
                    </Link>

                    <Link to="/aluno/videos" className="action-card">
                        <div className="action-card-icon" style={{ background: 'rgba(45, 90, 39, 0.15)', color: 'var(--color-primary)' }}>
                            🎬
                        </div>
                        <h3>Vídeos</h3>
                        <p>Assista às aulas em vídeo</p>
                    </Link>

                    <Link to="/aluno/pdfs" className="action-card">
                        <div className="action-card-icon" style={{ background: 'rgba(74, 144, 164, 0.15)', color: 'var(--color-accent)' }}>
                            📄
                        </div>
                        <h3>PDFs</h3>
                        <p>Leia os materiais didáticos</p>
                    </Link>

                    <Link to="/aluno/exercicios" className="action-card">
                        <div className="action-card-icon" style={{ background: 'rgba(40, 167, 69, 0.15)', color: 'var(--color-success)' }}>
                            ✍️
                        </div>
                        <h3>Exercícios</h3>
                        <p>Teste seus conhecimentos</p>
                    </Link>
                </div>

                {/* Quick Certificate Access */}
                {certificates.length > 0 && (
                    <div className="content-card" style={{ marginTop: '2rem' }}>
                        <div className="content-card-header">
                            <h2>🎓 Certificados Disponíveis</h2>
                        </div>
                        <div className="content-card-body">
                            <p style={{ marginBottom: '1rem' }}>
                                Parabéns! Você tem {certificates.length} certificado(s) disponível(is) para download.
                            </p>
                            <Link to="/aluno/certificado" className="btn btn-primary">
                                Ver Certificados
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default StudentDashboard;
