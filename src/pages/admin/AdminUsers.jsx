import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function AdminUsers() {
    const { getAllStudents, resetUserPassword } = useAuth();
    const [students, setStudents] = useState(getAllStudents());
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleResetClick = (user) => {
        setEditingUser(user);
        setNewPassword('');
    };

    const handleSavePassword = () => {
        if (!newPassword) {
            alert('Digite uma nova senha');
            return;
        }

        resetUserPassword(editingUser.id, newPassword);
        alert(`Senha de ${editingUser.name} redefinida com sucesso!`);
        setEditingUser(null);
        setNewPassword('');
        // Refresh list (though local state usually updates if we re-fetch, but getAllStudents reads from storage)
        setStudents(getAllStudents());
    };

    return (
        <div className="admin-content">
            <header className="page-header">
                <div>
                    <h1>Gestão de Alunos</h1>
                    <p>Visualize alunos cadastrados e gerencie acessos.</p>
                </div>
            </header>

            <div className="content-card">
                <div className="filters-bar">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Buscar por nome ou e-mail..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>Data Cadastro</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map(student => (
                                    <tr key={student.id}>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className="btn-text"
                                                onClick={() => handleResetClick(student)}
                                                title="Redefinir Senha"
                                            >
                                                🔑 Redefinir Senha
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="empty-state">
                                        Nenhum aluno encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Redefinição de Senha */}
            {editingUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Redefinir Senha - {editingUser.name}</h3>
                            <button
                                className="close-btn"
                                onClick={() => setEditingUser(null)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nova Senha</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Digite a nova senha"
                                />
                                <small className="help-text">
                                    Informe esta senha ao aluno para que ele possa acessar.
                                </small>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn-secondary"
                                onClick={() => setEditingUser(null)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleSavePassword}
                            >
                                Salvar Nova Senha
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;
