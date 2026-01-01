import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import CommentSection from '../../components/Comments/CommentSection';

function StudentExercises() {
  const { exercises, courses, modules, submitGrade, grades } = useData();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const exerciseId = searchParams.get('id');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [showComments, setShowComments] = useState(false);

  // Get available exercises for student
  const availableExercises = useMemo(() => {
    return exercises.map(exercise => {
      const course = courses.find(c => c.id === exercise.courseId);
      const module = modules.find(m => m.id === exercise.moduleId);
      const studentGrade = grades.find(g => g.userId === user.id && g.exerciseId === exercise.id);
      return {
        ...exercise,
        courseName: course?.title,
        moduleName: module?.title,
        completed: !!studentGrade,
        grade: studentGrade
      };
    });
  }, [exercises, courses, modules, grades, user.id]);

  const selectedExercise = exerciseId ? availableExercises.find(e => e.id === exerciseId) : null;
  const questions = selectedExercise?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer
    });
  };

  const handleSubmit = () => {
    let score = 0;
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        score += question.points;
      }
    });

    const resultData = submitGrade(user.id, selectedExercise.id, answers, score, totalPoints);
    setResult(resultData);
    setSubmitted(true);
  };

  if (!exerciseId) {
    // Show exercise list
    return (
      <>
        <header className="topbar">
          <div className="topbar-title">
            <h1>Exercícios</h1>
            <p>Teste seus conhecimentos</p>
          </div>
        </header>

        <div className="page-content">
          {availableExercises.length === 0 ? (
            <div className="content-card">
              <div className="content-card-body">
                <div className="empty-state">
                  <div className="empty-state-icon">✍️</div>
                  <h3>Nenhum exercício disponível</h3>
                  <p>Matricule-se em um curso para acessar os exercícios</p>
                  <Link to="/aluno/cursos" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Ver Cursos
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="items-list">
              {availableExercises.map(exercise => (
                <div key={exercise.id} className="item-row">
                  <div className="item-icon" style={{
                    background: exercise.completed ? 'var(--color-success)' : 'var(--color-primary)'
                  }}>
                    {exercise.completed ? '✓' : '✍️'}
                  </div>
                  <div className="item-info">
                    <h4>{exercise.title}</h4>
                    <p>
                      {exercise.courseName} • {exercise.moduleName}
                      {exercise.completed && (
                        <span style={{ marginLeft: '1rem', color: 'var(--color-success)' }}>
                          Nota: {exercise.grade?.percentage}%
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="item-actions">
                    <Link
                      to={`/aluno/exercicios?id=${exercise.id}`}
                      className="btn btn-primary btn-small"
                    >
                      {exercise.completed ? 'Refazer' : 'Iniciar'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  // Show selected exercise
  if (!selectedExercise) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <div className="empty-state-icon">❓</div>
          <h3>Exercício não encontrado</h3>
          <Link to="/aluno/exercicios" className="btn btn-primary">Voltar</Link>
        </div>
      </div>
    );
  }

  if (submitted && result) {
    // Show results
    return (
      <>
        <header className="topbar">
          <div className="topbar-title">
            <Link to="/aluno/exercicios" className="back-link">← Voltar</Link>
            <h1>Resultado</h1>
            <p>{selectedExercise.title}</p>
          </div>
        </header>

        <div className="page-content">
          <div className="content-card">
            <div className="content-card-body" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1rem',
                color: result.percentage >= 70 ? 'var(--color-success)' : 'var(--color-danger)'
              }}>
                {result.percentage >= 70 ? '🎉' : '📚'}
              </div>
              <h2 style={{ marginBottom: '0.5rem' }}>
                {result.percentage >= 70 ? 'Parabéns!' : 'Continue estudando!'}
              </h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                Você acertou {result.score} de {result.totalPoints} pontos
              </p>

              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: result.percentage >= 70 ? 'var(--color-success)' : 'var(--color-danger)',
                marginBottom: '2rem'
              }}>
                {result.percentage}%
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/aluno/exercicios" className="btn btn-outline">
                  Ver Outros Exercícios
                </Link>
                <Link to="/aluno/resultados" className="btn btn-primary">
                  Ver Meus Resultados
                </Link>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="content-card" style={{ marginTop: '2rem' }}>
            <div className="content-card-header">
              <h2>💬 Área de Dúvidas</h2>
            </div>
            <div className="content-card-body">
              <CommentSection
                contentId={selectedExercise.id}
                contentType="exercise"
                courseId={selectedExercise.courseId}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-title">
          <Link to="/aluno/exercicios" className="back-link">← Voltar</Link>
          <h1>{selectedExercise.title}</h1>
          <p>Questão {currentQuestionIndex + 1} de {questions.length}</p>
        </div>
      </header>

      <div className="page-content">
        <div className="exercise-panel">
          <div className="exercise-header">
            <h2>{selectedExercise.title}</h2>
            <div className="exercise-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span style={{ color: 'white', fontSize: 'var(--font-sm)' }}>
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
              </span>
            </div>
          </div>

          <div className="exercise-body">
            {currentQuestion && (
              <div className="question-block">
                <span className="question-number">
                  Questão {currentQuestionIndex + 1} • {currentQuestion.points} pontos
                </span>
                <p className="question-text">{currentQuestion.text}</p>

                {currentQuestion.type === 'multiple' && (
                  <div className="options-list">
                    {currentQuestion.options.map(option => (
                      <div
                        key={option.id}
                        className={`option-item ${answers[currentQuestion.id] === option.id ? 'selected' : ''}`}
                        onClick={() => handleAnswer(option.id)}
                      >
                        <div className="option-marker">
                          {option.id.toUpperCase()}
                        </div>
                        <span>{option.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'truefalse' && (
                  <div className="options-list">
                    <div
                      className={`option-item ${answers[currentQuestion.id] === true ? 'selected' : ''}`}
                      onClick={() => handleAnswer(true)}
                    >
                      <div className="option-marker">V</div>
                      <span>Verdadeiro</span>
                    </div>
                    <div
                      className={`option-item ${answers[currentQuestion.id] === false ? 'selected' : ''}`}
                      onClick={() => handleAnswer(false)}
                    >
                      <div className="option-marker">F</div>
                      <span>Falso</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="exercise-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
            >
              ← Anterior
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                disabled={!answers[currentQuestion?.id]}
              >
                Próxima →
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
              >
                Finalizar ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentExercises;
