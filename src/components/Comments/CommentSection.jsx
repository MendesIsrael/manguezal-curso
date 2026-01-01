import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import './CommentSection.css';

function CommentSection({ contentId, contentType, courseId }) {
    const { getCommentsByContent, addComment, deleteComment, resolveComment } = useData();
    const { user, isAdmin } = useAuth();
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const comments = getCommentsByContent(contentId, contentType);
    const topLevelComments = comments.filter(c => !c.parentId);

    const sortedComments = [...topLevelComments].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    const getReplies = (commentId) => {
        return comments
            .filter(c => c.parentId === commentId)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        addComment({
            contentId,
            contentType,
            courseId,
            userId: user.id,
            authorName: user.name,
            text: newComment.trim()
        });

        setNewComment('');
    };

    const handleReply = (e, parentComment) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        addComment({
            parentId: parentComment.id,
            contentId,
            contentType,
            courseId,
            userId: user.id,
            authorName: user.name,
            text: replyText.trim()
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
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Agora';
        if (diffMins < 60) return `${diffMins} min atrás`;
        if (diffHours < 24) return `${diffHours}h atrás`;
        if (diffDays < 7) return `${diffDays}d atrás`;

        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="comment-section">
            <div className="comment-section-header">
                <h3>💬 Comentários ({topLevelComments.length})</h3>
                <select
                    className="comment-sort"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                >
                    <option value="newest">Mais recentes</option>
                    <option value="oldest">Mais antigos</option>
                </select>
            </div>

            {/* New comment form */}
            <form className="comment-form" onSubmit={handleSubmit}>
                <div className="comment-form-avatar">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="comment-form-input">
                    <textarea
                        placeholder="Escreva um comentário ou dúvida..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        rows="2"
                    />
                    <button type="submit" className="btn btn-primary btn-small" disabled={!newComment.trim()}>
                        Comentar
                    </button>
                </div>
            </form>

            {/* Comments list */}
            <div className="comments-list">
                {sortedComments.length === 0 ? (
                    <div className="no-comments">
                        <p>Seja o primeiro a comentar!</p>
                    </div>
                ) : (
                    sortedComments.map(comment => {
                        const replies = getReplies(comment.id);
                        return (
                            <div key={comment.id} className={`comment-item ${comment.isPinned ? 'pinned' : ''}`}>
                                {comment.isPinned && (
                                    <div className="pinned-badge">📌 Comentário Fixado</div>
                                )}
                                <div className="comment-header">
                                    <div className="comment-avatar">
                                        {comment.authorName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="comment-meta">
                                        <strong>{comment.authorName}</strong>
                                        <span>{formatDate(comment.createdAt)}</span>
                                    </div>
                                    {comment.isResolved && (
                                        <span className="resolved-badge">✅ Resolvido</span>
                                    )}
                                </div>
                                <div className="comment-body">
                                    <p>{comment.text}</p>
                                </div>
                                <div className="comment-actions">
                                    <button
                                        className="comment-action-btn"
                                        onClick={() => setReplyingTo(comment)}
                                    >
                                        💬 Responder
                                    </button>
                                    {(comment.userId === user.id || isAdmin) && (
                                        <button
                                            className="comment-action-btn delete"
                                            onClick={() => handleDelete(comment.id)}
                                        >
                                            🗑️ Excluir
                                        </button>
                                    )}
                                </div>

                                {/* Reply form */}
                                {replyingTo?.id === comment.id && (
                                    <form className="reply-form" onSubmit={(e) => handleReply(e, comment)}>
                                        <textarea
                                            placeholder="Escreva sua resposta..."
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                            rows="2"
                                            autoFocus
                                        />
                                        <div className="reply-form-actions">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-small"
                                                onClick={() => setReplyingTo(null)}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-small"
                                                disabled={!replyText.trim()}
                                            >
                                                Responder
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Replies */}
                                {replies.length > 0 && (
                                    <div className="replies-list">
                                        {replies.map(reply => (
                                            <div key={reply.id} className="reply-item">
                                                <div className="comment-header">
                                                    <div className="comment-avatar small">
                                                        {reply.authorName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="comment-meta">
                                                        <strong>{reply.authorName}</strong>
                                                        <span>{formatDate(reply.createdAt)}</span>
                                                    </div>
                                                </div>
                                                <div className="comment-body">
                                                    <p>{reply.text}</p>
                                                </div>
                                                {(reply.userId === user.id || isAdmin) && (
                                                    <div className="comment-actions">
                                                        <button
                                                            className="comment-action-btn delete"
                                                            onClick={() => handleDelete(reply.id)}
                                                        >
                                                            🗑️ Excluir
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default CommentSection;
