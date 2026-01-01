import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

function StudentCourses() {
    const { courses, enrollments, enrollStudent, getCourseProgress, getCourseAverageGrade, getStudentCertificates } = useData();
    const { user } = useAuth();

    const studentEnrollments = enrollments.filter(e => e.userId === user.id);
    const enrolledCourseIds = studentEnrollments.map(e => e.courseId);
    const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id) && c.isActive);
    const availableCourses = courses.filter(c => !enrolledCourseIds.includes(c.id) && c.isActive);
    const certificates = getStudentCertificates(user.id);

    const handleEnroll = (courseId) => {
        enrollStudent(user.id, courseId);
    };

    const getProgressInfo = (courseId) => {
        const progress = getCourseProgress(user.id, courseId);
        const average = getCourseAverageGrade(user.id, courseId);
        const certificate = certificates.find(c => c.courseId === courseId);
        return { progress, average, hasCertificate: !!certificate };
    };

    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Meus Cursos</h1>
                    <p>Gerencie suas matrículas e acompanhe seu progresso</p>
                </div>
            </header>

            <div className="page-content">
                {/* Enrolled Courses */}
                <div className="content-card" style={{ marginBottom: '2rem' }}>
                    <div className="content-card-header">
                        <h2>📚 Cursos Matriculados</h2>
                    </div>
                    <div className="content-card-body">
                        {enrolledCourses.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📖</div>
                                <h3>Você ainda não está matriculado em nenhum curso</h3>
                                <p>Explore os cursos disponíveis abaixo e faça sua matrícula</p>
                            </div>
                        ) : (
                            <div className="enrolled-courses-list">
                                {enrolledCourses.map(course => {
                                    const info = getProgressInfo(course.id);
                                    return (
                                        <div key={course.id} className="enrolled-course-card">
                                            <div className="enrolled-course-icon">📖</div>
                                            <div className="enrolled-course-info">
                                                <h3>{course.title}</h3>
                                                <p>{course.description}</p>
                                                <div className="course-meta">
                                                    <span>⏱️ {course.duration}h</span>
                                                    <span>📊 Nota mín: {course.minGrade}%</span>
                                                </div>

                                                <div className="progress-section">
                                                    <div className="progress-header">
                                                        <span>Progresso</span>
                                                        <span>{info.progress}%</span>
                                                    </div>
                                                    <div className="progress-bar">
                                                        <div
                                                            className="progress-fill"
                                                            style={{ width: `${info.progress}%` }}
                                                        />
                                                    </div>
                                                    {info.average > 0 && (
                                                        <div className="grade-info">
                                                            Média atual: <strong>{info.average}%</strong>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="enrolled-course-actions">
                                                <Link
                                                    to={`/aluno/curso/${course.id}`}
                                                    className="btn btn-primary"
                                                >
                                                    Continuar
                                                </Link>
                                                {info.hasCertificate && (
                                                    <Link
                                                        to="/aluno/certificado"
                                                        className="btn btn-success"
                                                    >
                                                        🎓 Certificado
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Available Courses */}
                {availableCourses.length > 0 && (
                    <div className="content-card">
                        <div className="content-card-header">
                            <h2>🎯 Cursos Disponíveis</h2>
                        </div>
                        <div className="content-card-body">
                            <div className="available-courses-grid">
                                {availableCourses.map(course => (
                                    <div key={course.id} className="available-course-card">
                                        <div className="available-course-icon">📚</div>
                                        <h3>{course.title}</h3>
                                        <p>{course.description}</p>
                                        <div className="course-meta">
                                            <span>⏱️ {course.duration}h</span>
                                            <span>👨‍🏫 {course.professorName}</span>
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleEnroll(course.id)}
                                        >
                                            Matricular-se
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default StudentCourses;
