import { useState } from 'react';
import { useData } from '../../contexts/DataContext';

function AdminModules() {
    const {
        courses,
        modules,
        addModule,
        updateModule,
        deleteModule,
        getModulesByCourse,
        videos,
        pdfs,
        exercises
    } = useData();

    const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        order: 1
    });

    const courseModules = selectedCourseId ? getModulesByCourse(selectedCourseId) : [];

    const handleSubmit = (e) => {
        e.preventDefault();

        const moduleData = {
            ...formData,
            courseId: selectedCourseId
        };

        if (editingModule) {
            updateModule(editingModule.id, moduleData);
        } else {
            addModule(moduleData);
        }

        handleCloseModal();
    };

    const handleEdit = (module) => {
        setEditingModule(module);
        setFormData({
            title: module.title,
            description: module.description,
            order: module.order
        });
        setIsModalOpen(true);
    };

    const handleDelete = (moduleId) => {
        if (confirm('Tem certeza que deseja excluir este módulo? Todo o conteúdo será removido.')) {
            deleteModule(moduleId);
        }
    };

    const handleOpenModal = () => {
        setFormData({
            title: '',
            description: '',
            order: courseModules.length + 1
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingModule(null);
        setFormData({
            title: '',
            description: '',
            order: 1
        });
    };

    const getModuleStats = (moduleId) => {
        return {
            videos: videos.filter(v => v.moduleId === moduleId).length,
            pdfs: pdfs.filter(p => p.moduleId === moduleId).length,
            exercises: exercises.filter(e => e.moduleId === moduleId).length
        };
    };

    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Gerenciar Módulos</h1>
                    <p>Organize os módulos de cada curso</p>
                </div>
                <div className="topbar-actions">
                    {selectedCourseId && (
                        <button className="btn btn-primary" onClick={handleOpenModal}>
                            + Novo Módulo
                        </button>
                    )}
                </div>
            </header>

            <div className="page-content">
                {/* Course Selector */}
                <div className="content-card" style={{ marginBottom: '2rem' }}>
                    <div className="content-card-body">
                        <div className="form-group">
                            <label>Selecione o Curso</label>
                            <select
                                className="form-input"
                                value={selectedCourseId}
                                onChange={e => setSelectedCourseId(e.target.value)}
                            >
                                <option value="">-- Selecione um curso --</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Modules List */}
                {!selectedCourseId ? (
                    <div className="content-card">
                        <div className="content-card-body">
                            <div className="empty-state">
                                <div className="empty-state-icon">📋</div>
                                <h3>Selecione um curso</h3>
                                <p>Escolha um curso acima para gerenciar seus módulos</p>
                            </div>
                        </div>
                    </div>
                ) : courseModules.length === 0 ? (
                    <div className="content-card">
                        <div className="content-card-body">
                            <div className="empty-state">
                                <div className="empty-state-icon">📦</div>
                                <h3>Nenhum módulo cadastrado</h3>
                                <p>Crie o primeiro módulo para este curso</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="modules-list">
                        {courseModules.map((module, index) => {
                            const stats = getModuleStats(module.id);
                            return (
                                <div key={module.id} className="module-item">
                                    <div className="module-order">
                                        <span>Módulo {index + 1}</span>
                                    </div>
                                    <div className="module-content">
                                        <h3>{module.title}</h3>
                                        <p>{module.description}</p>
                                        <div className="module-stats">
                                            <span>🎬 {stats.videos} vídeos</span>
                                            <span>📄 {stats.pdfs} PDFs</span>
                                            <span>✍️ {stats.exercises} exercícios</span>
                                        </div>
                                    </div>
                                    <div className="module-actions">
                                        <button
                                            className="btn btn-outline btn-small"
                                            onClick={() => handleEdit(module)}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-small"
                                            onClick={() => handleDelete(module.id)}
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
                            <h2>{editingModule ? 'Editar Módulo' : 'Novo Módulo'}</h2>
                            <button className="modal-close" onClick={handleCloseModal}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Título do Módulo</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Ex: Introdução ao Manguezal"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Descrição</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Descreva o conteúdo deste módulo..."
                                        rows="3"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Ordem</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.order}
                                        onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingModule ? 'Salvar Alterações' : 'Criar Módulo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminModules;
