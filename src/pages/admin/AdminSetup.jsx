import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

function AdminSetup() {
    const { professorInfo, updateProfessorInfo } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        professorName: professorInfo?.professorName || '',
        professorTitle: professorInfo?.professorTitle || '',
        professorBio: professorInfo?.professorBio || '',
        institutionName: professorInfo?.institutionName || 'Instituto Federal do Rio de Janeiro (IFRJ)',
        programName: professorInfo?.programName || 'Programa de Pós-graduação em Ensino de Ciências (PROPEC)'
    });
    const [photoPreview, setPhotoPreview] = useState(professorInfo?.photo || null);
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfessorInfo({
            ...formData,
            photo: photoPreview
        });
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
        }, 3000);
    };

    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Configuração do Professor</h1>
                    <p>Edite as informações exibidas na página inicial do curso</p>
                </div>
            </header>

            <div className="page-content">
                {/* Banner informativo */}
                <div className="info-banner">
                    <div className="info-banner-icon">🎓</div>
                    <div className="info-banner-content">
                        <p>
                            <strong>Este Produto Educacional (PE) é fruto de uma pesquisa de mestrado profissional
                                desenvolvida no Programa de Pós-graduação em Ensino de Ciências (PROPEC) do
                                Instituto Federal do Rio de Janeiro (IFRJ).</strong>
                        </p>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
                            Este texto é exibido automaticamente na página de login para todos os visitantes.
                        </p>
                    </div>
                </div>

                {saved && (
                    <div className="success-banner">
                        <span>✅</span> Informações salvas com sucesso! As alterações já estão visíveis na página de login.
                    </div>
                )}

                <div className="content-card">
                    <div className="content-card-header">
                        <h2>Credenciais do Professor</h2>
                    </div>
                    <div className="content-card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="setup-grid">
                                <div className="setup-photo-section">
                                    <div className="photo-upload-container">
                                        <div
                                            className="photo-preview"
                                            style={{ backgroundImage: photoPreview ? `url(${photoPreview})` : 'none' }}
                                        >
                                            {!photoPreview && (
                                                <div className="photo-placeholder">
                                                    <span>👤</span>
                                                    <span>Foto do Professor</span>
                                                </div>
                                            )}
                                        </div>
                                        <label className="photo-upload-btn">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                hidden
                                            />
                                            📷 {photoPreview ? 'Alterar Foto' : 'Escolher Foto'}
                                        </label>
                                        <p className="photo-hint">Formatos: JPG, PNG (máx. 5MB)</p>
                                        <p className="photo-hint" style={{ marginTop: '0.5rem' }}>
                                            Esta foto será exibida na página de login
                                        </p>
                                    </div>
                                </div>

                                <div className="setup-form-section">
                                    <div className="form-group">
                                        <label htmlFor="professorName">Nome Completo do Professor *</label>
                                        <input
                                            type="text"
                                            id="professorName"
                                            name="professorName"
                                            className="form-input"
                                            placeholder="Ex: Prof. Dr. João da Silva"
                                            value={formData.professorName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="professorTitle">Titulação</label>
                                        <input
                                            type="text"
                                            id="professorTitle"
                                            name="professorTitle"
                                            className="form-input"
                                            placeholder="Ex: Doutor em Ciências Ambientais"
                                            value={formData.professorTitle}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="professorBio">Breve Biografia</label>
                                        <textarea
                                            id="professorBio"
                                            name="professorBio"
                                            className="form-textarea"
                                            placeholder="Escreva uma breve apresentação sobre o professor..."
                                            value={formData.professorBio}
                                            onChange={handleChange}
                                            rows={4}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="institutionName">Instituição</label>
                                        <input
                                            type="text"
                                            id="institutionName"
                                            name="institutionName"
                                            className="form-input"
                                            value={formData.institutionName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="programName">Programa</label>
                                        <input
                                            type="text"
                                            id="programName"
                                            name="programName"
                                            className="form-input"
                                            value={formData.programName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    💾 Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="content-card" style={{ marginTop: '2rem', borderTop: '4px solid #dc2626' }}>
                    <div className="content-card-header">
                        <h2 style={{ color: '#dc2626' }}>⚠️ Zona de Perigo - Banco de Dados</h2>
                    </div>
                    <div className="content-card-body">
                        <p style={{ marginBottom: '1rem', color: '#666' }}>
                            Utilize esta opção apenas se o banco de dados estiver vazio ou corrompido.
                            Esta ação irá popular o banco com os dados iniciais do curso (cursos, módulos, exercícios padrão).
                        </p>
                        <button
                            type="button"
                            className="btn"
                            style={{ backgroundColor: '#dc2626', color: 'white' }}
                            onClick={() => {
                                if (window.confirm('Tem certeza? Isso pode duplicar dados existem se o banco não estiver vazio.')) {
                                    useData().seedDatabase();
                                }
                            }}
                        >
                            🔄 Restaurar/Popular Banco de Dados (Seed)
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminSetup;
