import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

function AdminComments() {
    const { comments, updateComment, deleteComment, pinComment, resolveComment, courses } = useData();
    const { getAllStudents } = useAuth();
    const [filter, setFilter] = useState('all');
    const [courseFilter, setCourseFilter] = useState('all');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const { user } = useAuth();
    const { addComment } = useData();

    const students = getAllStudents();

    const getStudentName = (userId) => {
        const student = students.find(s => s.id === userId);
        return student?.name || 'Usuário Desconhecido';
    };

    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course?.title || 'Curso Desconhecido';
    };

    const filteredComments = comments
        .filter(c => !c.parentId) // Only top-level comments
        .filter(c => {
            if (filter === 'unresolved') return !c.isResolved;
            if (filter === 'pinned') return c.isPinned;
            if (filter === 'resolved') return c.isResolved;
            return true;
        })
        .filter(c => {
            if (courseFilter === 'all') return true;
            return c.courseId === courseFilter;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const getReplies = (commentId) => {
        return comments.filter(c => c.parentId === commentId);
    };

    const handleReply = (e) => {
        e.preventDefault();
        if (!replyText.trim() || !replyingTo) return;

        addComment({
            parentId: replyingTo.id,
            contentId: replyingTo.contentId,
            contentType: replyingTo.contentType,
            courseId: replyingTo.courseId,
            userId: user.id,
            authorName: user.name,
            text: replyText
        });

        setReplyingTo(null);
        setReplyText('');
    };

    const handleDelete = (commentId) => {
        if (confirm('Tem certeza que deseja excluir este comentário?')) {
            deleteComment(commentId);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Moderação de Comentários</h1>
                    <p>Gerencie os comentários dos alunos</p>
                </div>
                <div className="topbar-actions">
                    <span className="comment-count">
                        {filteredComments.length} comentário(s)
                    </span>
                </div>
            </header>

            <div className="page-content">
                {/* Filters */}
                <div className="content-card" style={{ marginBottom: '2rem' }}>
                    <div className="content-card-body">
                        <div className="filters-row">
                            <div className="form-group">
                                <label>Filtrar por Status</label>
                                <select
                                    className="form-input"
                                    value={filter}
                                    onChange={e => setFilter(e.target.value)}
                                >
                                    <option value="all">Todos</option>
                                    <option value="unresolved">Não Resolvidos</option>
                                    <option value="pinned">Fixados</option>
                                    <option value="resolved">Resolvidos</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Filtrar por Curso</label>
                                <select
                                    className="form-input"
                                    value={courseFilter}
                                    onChange={e => setCourseFilter(e.target.value)}
                                >
                                    <option value="all">Todos os Cursos</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments List */}
                {filteredComments.length === 0 ? (
                    <div className="content-card">
                        <div className="content-card-body">
                            <div className="empty-state">
                                <div className="empty-state-icon">💬</div>
                                <h3>Nenhum comentário encontrado</h3>
                                <p>Os comentários dos alunos aparecerão aqui</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="comments-admin-list">
                        {filteredComments.map(comment => {
                            const replies = getReplies(comment.id);
                            return (
                                <div key={comment.id} className="comment-admin-card">
                                    <div className="comment-admin-header">
                                        <div className="comment-author">
                                            <div className="comment-avatar">
                                                {getStudentName(comment.userId).charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <strong>{comment.authorName || getStudentName(comment.userId)}</strong>
                                                <span className="comment-meta">
                                                    {formatDate(comment.createdAt)} • {getCourseName(comment.courseId)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="comment-badges">
                                            {comment.isPinned && (
                                                <span className="badge badge-pinned">📌 Fixado</span>
                                            )}
                                            {comment.isResolved && (
                                                <span className="badge badge-resolved">✅ Resolvido</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="comment-admin-body">
                                        <p>{comment.text}</p>
                                    </div>

                                    {/* Replies */}
                                    {replies.length > 0 && (
                                        <div className="comment-replies">
                                            {replies.map(reply => (
                                                <div key={reply.id} className="comment-reply">
                                                    <div className="reply-header">
                                                        <strong>{reply.authorName}</strong>
                                                        <span>{formatDate(reply.createdAt)}</span>
                                                    </div>
                                                    <p>{reply.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Reply Form */}
                                    {replyingTo?.id === comment.id && (
                                        <form className="reply-form" onSubmit={handleReply}>
                                            <textarea
                                                className="form-textarea"
                                                value={replyText}
                                                onChange={e => setReplyText(e.target.value)}
                                                placeholder="Escreva sua resposta..."
                                                rows="2"
                                            />
                                            <div className="reply-form-actions">
                                                <button type="button" className="btn btn-secondary btn-small" onClick={() => setReplyingTo(null)}>
                                                    Cancelar
                                                </button>
                                                <button type="submit" className="btn btn-primary btn-small">
                                                    Responder
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    <div className="comment-admin-actions">
                                        <button
                                            className="btn btn-outline btn-small"
                                            onClick={() => setReplyingTo(comment)}
                                        >
                                            💬 Responder
                                        </button>
                                        <button
                                            className={`btn ${comment.isPinned ? 'btn-primary' : 'btn-outline'} btn-small`}
                                            onClick={() => pinComment(comment.id, !comment.isPinned)}
                                        >
                                            📌 {comment.isPinned ? 'Desfixar' : 'Fixar'}
                                        </button>
                                        <button
                                            className={`btn ${comment.isResolved ? 'btn-success' : 'btn-outline'} btn-small`}
                                            onClick={() => resolveComment(comment.id, !comment.isResolved)}
                                        >
                                            ✅ {comment.isResolved ? 'Reabrir' : 'Resolvido'}
                                        </button>
                                        <button
                                            className="btn btn-danger btn-small"
                                            onClick={() => handleDelete(comment.id)}
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
        </>
    );
}

export default AdminComments;
