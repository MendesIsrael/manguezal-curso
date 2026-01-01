import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('student');
    const { login, loginWithGoogle, professorInfo } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = login(email, password, userType);

        if (result.success) {
            if (userType === 'admin') {
                navigate('/admin');
            } else {
                navigate('/aluno');
            }
        } else {
            alert(result.error);
        }
    };

    const handleGoogleLogin = () => {
        loginWithGoogle();
        navigate('/aluno');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-hero">
                    <h1>
                        Curso <span>Manguezal</span>
                    </h1>

                    {/* Professor Info Section */}
                    <div className="professor-section">
                        {professorInfo?.photo ? (
                            <div
                                className="professor-photo"
                                style={{ backgroundImage: `url(${professorInfo.photo})` }}
                            />
                        ) : (
                            <div className="professor-photo professor-photo-placeholder">
                                👨‍🏫
                            </div>
                        )}
                        <div className="professor-info">
                            <h3>{professorInfo?.professorName || 'Professor Responsável'}</h3>
                            {professorInfo?.professorTitle && (
                                <p className="professor-title">{professorInfo.professorTitle}</p>
                            )}
                        </div>
                    </div>

                    <p className="course-description">
                        Explore a riqueza do ecossistema manguezal através de nossa
                        plataforma educacional interativa. Aprenda sobre biodiversidade,
                        conservação e a importância deste habitat único.
                    </p>

                    {/* PROPEC/IFRJ Info */}
                    <div className="academic-info">
                        <div className="academic-badge">🎓</div>
                        <p>
                            Este Produto Educacional (PE) é fruto de uma pesquisa de mestrado
                            profissional desenvolvida no <strong>Programa de Pós-graduação em
                                Ensino de Ciências (PROPEC)</strong> do <strong>Instituto Federal
                                    do Rio de Janeiro (IFRJ)</strong>.
                        </p>
                    </div>

                    <div className="login-features">
                        <div className="login-feature">
                            <div className="login-feature-icon">🎬</div>
                            <span>Vídeos educativos</span>
                        </div>
                        <div className="login-feature">
                            <div className="login-feature-icon">📚</div>
                            <span>Material didático em PDF</span>
                        </div>
                        <div className="login-feature">
                            <div className="login-feature-icon">✍️</div>
                            <span>Exercícios interativos</span>
                        </div>
                        <div className="login-feature">
                            <div className="login-feature-icon">📊</div>
                            <span>Acompanhamento de progresso</span>
                        </div>
                    </div>
                </div>

                <div className="login-card">
                    <div className="login-card-header">
                        <div className="login-logo">🌿</div>
                        <h2>Bem-vindo!</h2>
                        <p>Faça login para acessar o curso</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tipo de Usuário</label>
                            <div className="user-type-selector">
                                <div
                                    className={`user-type-option ${userType === 'student' ? 'active' : ''}`}
                                    onClick={() => setUserType('student')}
                                >
                                    <div className="icon">🎓</div>
                                    <div className="label">Aluno</div>
                                </div>
                                <div
                                    className={`user-type-option ${userType === 'admin' ? 'active' : ''}`}
                                    onClick={() => setUserType('admin')}
                                >
                                    <div className="icon">👨‍💼</div>
                                    <div className="label">Administrador</div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Senha</label>
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-login">
                            Entrar
                        </button>

                        {userType === 'student' && (
                            <>
                                <div className="login-divider">
                                    <span>ou</span>
                                </div>

                                <button
                                    type="button"
                                    className="btn-google"
                                    onClick={handleGoogleLogin}
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '10px' }}>
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Entrar com Google
                                </button>
                            </>
                        )}
                    </form>

                    <div className="login-footer">
                        {userType === 'student' ? (
                            <p>
                                Primeiro acesso? <Link to="/cadastro">Criar conta</Link>
                            </p>
                        ) : (
                            <p>
                                Acesso restrito a administradores
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
