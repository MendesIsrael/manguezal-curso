import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { v4 as uuidv4 } from 'uuid';

function AdminExercises() {
    const { courses, modules, exercises, addExercise, deleteExercise, getModulesByCourse } = useData();
    const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
    const [selectedModuleId, setSelectedModuleId] = useState('');
    const [questionType, setQuestionType] = useState('multiple');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        questions: []
    });
    const [currentQuestion, setCurrentQuestion] = useState({
        type: 'multiple',
        text: '',
        options: [
            { id: 'a', text: '' },
            { id: 'b', text: '' },
            { id: 'c', text: '' },
            { id: 'd', text: '' }
        ],
        correctAnswer: '',
        points: 10
    });

    const courseModules = selectedCourseId ? getModulesByCourse(selectedCourseId) : [];
    const moduleExercises = selectedModuleId
        ? exercises.filter(e => e.moduleId === selectedModuleId)
        : [];

    const handleAddQuestion = () => {
        if (!currentQuestion.text.trim()) {
            alert('Digite o enunciado da questão');
            return;
        }
        if (currentQuestion.type === 'multiple' && !currentQuestion.correctAnswer) {
            alert('Selecione a alternativa correta');
            return;
        }

        const newQuestion = {
            id: uuidv4(),
            ...currentQuestion
        };

        setFormData({
            ...formData,
            questions: [...formData.questions, newQuestion]
        });

        // Reset current question
        setCurrentQuestion({
            type: questionType,
            text: '',
            options: [
                { id: 'a', text: '' },
                { id: 'b', text: '' },
                { id: 'c', text: '' },
                { id: 'd', text: '' }
            ],
            correctAnswer: '',
            points: 10
        });
    };

    const handleRemoveQuestion = (questionId) => {
        setFormData({
            ...formData,
            questions: formData.questions.filter(q => q.id !== questionId)
        });
    };

    const handleSaveExercise = () => {
        if (!selectedModuleId) {
            alert('Selecione um módulo');
            return;
        }
        if (!formData.title.trim()) {
            alert('Digite o título do exercício');
            return;
        }
        if (formData.questions.length === 0) {
            alert('Adicione pelo menos uma questão');
            return;
        }

        const totalPoints = formData.questions.reduce((sum, q) => sum + q.points, 0);

        addExercise({
            ...formData,
            courseId: selectedCourseId,
            moduleId: selectedModuleId,
            totalPoints,
            order: moduleExercises.length + 1
        });

        // Reset form
        setFormData({
            title: '',
            description: '',
            questions: []
        });
    };

    const handleDelete = (exerciseId) => {
        if (confirm('Tem certeza que deseja excluir este exercício?')) {
            deleteExercise(exerciseId);
        }
    };

    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Criar Exercícios</h1>
                    <p>Crie e gerencie os exercícios do curso</p>
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

                <div className="content-card">
                    <div className="content-card-header">
                        <h2>Criar Novo Exercício</h2>
                    </div>
                    <div className="content-card-body">
                        <div className="exercise-creator">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Título do Exercício</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ex: Avaliação Módulo 1"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Descrição</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Breve descrição do exercício"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Questions added */}
                            {formData.questions.length > 0 && (
                                <div className="questions-list" style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                                    <h4 style={{ marginBottom: '1rem' }}>Questões Adicionadas ({formData.questions.length})</h4>
                                    {formData.questions.map((q, index) => (
                                        <div key={q.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0.5rem',
                                            borderBottom: '1px solid var(--bg-secondary)'
                                        }}>
                                            <span>
                                                <strong>Questão {index + 1}:</strong> {q.text.substring(0, 50)}...
                                                <span style={{ color: 'var(--text-light)', marginLeft: '1rem' }}>({q.points} pts)</span>
                                            </span>
                                            <button
                                                className="btn btn-danger btn-small"
                                                onClick={() => handleRemoveQuestion(q.id)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="form-group">
                                <label>Tipo de Questão</label>
                                <div className="tabs">
                                    <button
                                        type="button"
                                        className={`tab ${questionType === 'multiple' ? 'active' : ''}`}
                                        onClick={() => {
                                            setQuestionType('multiple');
                                            setCurrentQuestion({ ...currentQuestion, type: 'multiple' });
                                        }}
                                    >
                                        Múltipla Escolha
                                    </button>
                                    <button
                                        type="button"
                                        className={`tab ${questionType === 'truefalse' ? 'active' : ''}`}
                                        onClick={() => {
                                            setQuestionType('truefalse');
                                            setCurrentQuestion({ ...currentQuestion, type: 'truefalse' });
                                        }}
                                    >
                                        Verdadeiro/Falso
                                    </button>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label>Enunciado da Questão</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Digite o enunciado da questão..."
                                        value={currentQuestion.text}
                                        onChange={e => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Pontuação</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={currentQuestion.points}
                                        onChange={e => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) })}
                                        min="1"
                                    />
                                </div>
                            </div>

                            {questionType === 'multiple' && (
                                <div className="form-group">
                                    <label>Alternativas (selecione a correta)</label>
                                    <div className="answer-options">
                                        {currentQuestion.options.map((option) => (
                                            <div key={option.id} className="answer-option-row">
                                                <input
                                                    type="radio"
                                                    name="correct"
                                                    checked={currentQuestion.correctAnswer === option.id}
                                                    onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: option.id })}
                                                />
                                                <span style={{ fontWeight: 'bold', minWidth: '20px' }}>{option.id.toUpperCase()})</span>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder={`Alternativa ${option.id.toUpperCase()}`}
                                                    value={option.text}
                                                    onChange={e => {
                                                        const newOptions = currentQuestion.options.map(o =>
                                                            o.id === option.id ? { ...o, text: e.target.value } : o
                                                        );
                                                        setCurrentQuestion({ ...currentQuestion, options: newOptions });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {questionType === 'truefalse' && (
                                <div className="form-group">
                                    <label>Resposta Correta</label>
                                    <div className="user-type-selector" style={{ maxWidth: '300px' }}>
                                        <div
                                            className={`user-type-option ${currentQuestion.correctAnswer === true ? 'active' : ''}`}
                                            onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: true })}
                                        >
                                            <div className="icon">✓</div>
                                            <div className="label">Verdadeiro</div>
                                        </div>
                                        <div
                                            className={`user-type-option ${currentQuestion.correctAnswer === false ? 'active' : ''}`}
                                            onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: false })}
                                        >
                                            <div className="icon">✕</div>
                                            <div className="label">Falso</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={handleAddQuestion}
                                >
                                    + Adicionar Questão
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSaveExercise}
                                    disabled={!selectedModuleId || formData.questions.length === 0}
                                >
                                    💾 Salvar Exercício
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="content-card" style={{ marginTop: '2rem' }}>
                    <div className="content-card-header">
                        <h2>Exercícios Cadastrados {selectedModuleId && `(${moduleExercises.length})`}</h2>
                    </div>
                    <div className="content-card-body">
                        {!selectedModuleId ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📋</div>
                                <h3>Selecione um módulo</h3>
                                <p>Escolha um curso e módulo acima para ver os exercícios</p>
                            </div>
                        ) : moduleExercises.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">✍️</div>
                                <h3>Nenhum exercício cadastrado</h3>
                                <p>Crie o primeiro exercício acima</p>
                            </div>
                        ) : (
                            <div className="items-list">
                                {moduleExercises.map(exercise => (
                                    <div key={exercise.id} className="item-row">
                                        <div className="item-icon" style={{ background: 'var(--color-success)' }}>✍️</div>
                                        <div className="item-info">
                                            <h4>{exercise.title}</h4>
                                            <p>
                                                {exercise.questions?.length || 0} questões •
                                                {exercise.totalPoints} pontos
                                            </p>
                                        </div>
                                        <div className="item-actions">
                                            <button
                                                className="btn btn-danger btn-small"
                                                onClick={() => handleDelete(exercise.id)}
                                            >
                                                🗑️ Excluir
                                            </button>
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

export default AdminExercises;
