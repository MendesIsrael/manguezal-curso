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
        if (window.confirm(`Deseja enviar um e-mail de redefinição de senha para ${user.name} (${user.email})?`)) {
            handleSendReset(user.email);
        }
    };

    const handleSendReset = async (email) => {
        const result = await resetUserPassword(email);
        if (result.success) {
            alert(result.message);
        } else {
            alert('Erro: ' + result.error);
        }
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
                                                title="Enviar Email de Redefinição"
                                            >
                                                📧 Redefinir Senha
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
        </div>
    );
}

export default AdminUsers;
