import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

function StudentResults() {
    const { user } = useAuth();
    const { grades, exercises, courses, modules, progress, enrollments, getCourseProgress, getCourseAverageGrade } = useData();

    const studentGrades = grades.filter(g => g.userId === user.id);
    const studentEnrollments = enrollments.filter(e => e.userId === user.id);

    // Overall stats
    const totalExercises = studentGrades.length;
    const averagePercentage = totalExercises > 0
        ? Math.round(studentGrades.reduce((sum, g) => sum + g.percentage, 0) / totalExercises)
        : 0;

    const overallProgress = progress.filter(p => p.userId === user.id);
    const completedProgress = overallProgress.filter(p => p.completed).length;
    const progressPercentage = overallProgress.length > 0
        ? Math.round((completedProgress / overallProgress.length) * 100)
        : 0;

    // Study time estimation (based on completed videos)
    const completedVideos = progress.filter(
        p => p.userId === user.id && p.contentType === 'video' && p.completed
    ).length;
    const estimatedHours = Math.round(completedVideos * 0.25); // 15 min avg per video

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getExerciseInfo = (exerciseId) => {
        const exercise = exercises.find(e => e.id === exerciseId);
        const module = modules.find(m => m.id === exercise?.moduleId);
        const course = courses.find(c => c.id === exercise?.courseId);
        return {
            title: exercise?.title || 'Exercício',
            moduleName: module?.title,
            courseName: course?.title
        };
    };

    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Meus Resultados</h1>
                    <p>Acompanhe seu desempenho no curso</p>
                </div>
            </header>

            <div className="page-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon primary">📊</div>
                        <div className="stat-info">
                            <h3>{progressPercentage}%</h3>
                            <p>Progresso Total</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon success">✅</div>
                        <div className="stat-info">
                            <h3>{averagePercentage > 0 ? `${averagePercentage}%` : '--'}</h3>
                            <p>Média de Acertos</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon accent">🎯</div>
                        <div className="stat-info">
                            <h3>{totalExercises}</h3>
                            <p>Exercícios Concluídos</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon secondary">⏱️</div>
                        <div className="stat-info">
                            <h3>{estimatedHours}h</h3>
                            <p>Tempo de Estudo</p>
                        </div>
                    </div>
                </div>

                {/* Course Progress */}
                {studentEnrollments.length > 0 && (
                    <div className="content-card" style={{ marginBottom: '2rem' }}>
                        <div className="content-card-header">
                            <h2>📚 Progresso por Curso</h2>
                        </div>
                        <div className="content-card-body">
                            {studentEnrollments.map(enrollment => {
                                const course = courses.find(c => c.id === enrollment.courseId);
                                const courseProgress = getCourseProgress(user.id, enrollment.courseId);
                                const courseAverage = getCourseAverageGrade(user.id, enrollment.courseId);

                                if (!course) return null;

                                return (
                                    <div key={enrollment.id} style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <strong>{course.title}</strong>
                                            <span>{courseProgress}% concluído</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${courseProgress}%` }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: 'var(--font-sm)', color: 'var(--text-light)' }}>
                                            <span>Nota mínima: {course.minGrade}%</span>
                                            <span>Sua média: {courseAverage > 0 ? `${courseAverage}%` : '--'}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="content-card">
                    <div className="content-card-header">
                        <h2>📋 Histórico de Exercícios</h2>
                    </div>
                    <div className="content-card-body">
                        {studentGrades.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📋</div>
                                <h3>Nenhum resultado ainda</h3>
                                <p>Complete exercícios para ver seus resultados aqui</p>
                                <Link to="/aluno/exercicios" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                    Ver Exercícios
                                </Link>
                            </div>
                        ) : (
                            <table className="reports-table">
                                <thead>
                                    <tr>
                                        <th>Exercício</th>
                                        <th>Curso</th>
                                        <th>Data</th>
                                        <th>Pontuação</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentGrades
                                        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                                        .map(grade => {
                                            const info = getExerciseInfo(grade.exerciseId);
                                            const course = courses.find(c => c.id === grade.courseId);
                                            const passed = grade.percentage >= (course?.minGrade || 70);

                                            return (
                                                <tr key={grade.id}>
                                                    <td>
                                                        <strong>{info.title}</strong>
                                                        {info.moduleName && (
                                                            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-light)' }}>
                                                                {info.moduleName}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>{info.courseName}</td>
                                                    <td>{formatDate(grade.submittedAt)}</td>
                                                    <td>
                                                        <strong>{grade.score}/{grade.totalPoints}</strong>
                                                        <span style={{ marginLeft: '0.5rem', color: 'var(--text-light)' }}>
                                                            ({grade.percentage}%)
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${passed ? 'completed' : 'pending'}`}>
                                                            {passed ? 'Aprovado' : 'Refazer'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default StudentResults;
