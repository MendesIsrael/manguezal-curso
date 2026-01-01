import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

function AdminCourses() {
    const { courses, addCourse, updateCourse, deleteCourse, modules, enrollments } = useData();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: 40,
        minGrade: 70,
        isActive: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const courseData = {
            ...formData,
            professorId: user.id,
            professorName: user.name
        };

        if (editingCourse) {
            updateCourse(editingCourse.id, courseData);
        } else {
            addCourse(courseData);
        }

        handleCloseModal();
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            description: course.description,
            duration: course.duration,
            minGrade: course.minGrade,
            isActive: course.isActive
        });
        setIsModalOpen(true);
    };

    const handleDelete = (courseId) => {
        if (confirm('Tem certeza que deseja excluir este curso? Todos os módulos e conteúdos serão removidos.')) {
            deleteCourse(courseId);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
        setFormData({
            title: '',
            description: '',
            duration: 40,
            minGrade: 70,
            isActive: true
        });
    };

    const getCourseStats = (courseId) => {
        const courseModules = modules.filter(m => m.courseId === courseId);
        const courseEnrollments = enrollments.filter(e => e.courseId === courseId);
        return {
            modules: courseModules.length,
            students: courseEnrollments.length
        };
    };

    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Gerenciar Cursos</h1>
                    <p>Crie e gerencie os cursos da plataforma</p>
                </div>
                <div className="topbar-actions">
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        + Novo Curso
                    </button>
                </div>
            </header>

            <div className="page-content">
                {courses.length === 0 ? (
                    <div className="content-card">
                        <div className="content-card-body">
                            <div className="empty-state">
                                <div className="empty-state-icon">📚</div>
                                <h3>Nenhum curso cadastrado</h3>
                                <p>Crie o primeiro curso clicando no botão acima</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="courses-grid">
                        {courses.map(course => {
                            const stats = getCourseStats(course.id);
                            return (
                                <div key={course.id} className="course-card">
                                    <div className="course-card-header">
                                        <div className="course-card-icon">📖</div>
                                        <span className={`course-status ${course.isActive ? 'active' : 'inactive'}`}>
                                            {course.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                    <div className="course-card-body">
                                        <h3>{course.title}</h3>
                                        <p>{course.description}</p>
                                        <div className="course-meta">
                                            <span>⏱️ {course.duration}h</span>
                                            <span>📊 Nota mín: {course.minGrade}%</span>
                                        </div>
                                        <div className="course-stats">
                                            <div className="course-stat">
                                                <strong>{stats.modules}</strong>
                                                <span>Módulos</span>
                                            </div>
                                            <div className="course-stat">
                                                <strong>{stats.students}</strong>
                                                <span>Alunos</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="course-card-actions">
                                        <button
                                            className="btn btn-outline btn-small"
                                            onClick={() => handleEdit(course)}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-small"
                                            onClick={() => handleDelete(course.id)}
                                        >
                                            🗑️ Excluir
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingCourse ? 'Editar Curso' : 'Novo Curso'}</h2>
                            <button className="modal-close" onClick={handleCloseModal}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Título do Curso</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Ex: Ecossistema Manguezal"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Descrição</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Descreva o conteúdo do curso..."
                                        rows="3"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Carga Horária (horas)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.duration}
                                            onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Nota Mínima para Aprovação (%)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.minGrade}
                                            onChange={e => setFormData({ ...formData, minGrade: parseInt(e.target.value) })}
                                            min="0"
                                            max="100"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        Curso ativo (visível para alunos)
                                    </label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingCourse ? 'Salvar Alterações' : 'Criar Curso'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminCourses;
