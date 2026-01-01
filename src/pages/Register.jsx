import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/login.css';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        register(formData.name, formData.email, 'student');
        navigate('/aluno');
    };

    const handleGoogleLogin = () => {
        // Simulação de login com Google - em produção, integraria com Google OAuth
        register('Usuário Google', 'google-user@gmail.com', 'student');
        navigate('/aluno');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-hero">
                    <h1>
                        Curso <span>Manguezal</span>
                    </h1>
                    <p>
                        Explore a riqueza do ecossistema manguezal através de nossa
                        plataforma educacional interativa. Aprenda sobre biodiversidade,
                        conservação e a importância deste habitat único.
                    </p>

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
                        <h2>Cadastro de Aluno</h2>
                        <p>Crie sua conta para acessar o curso</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Nome Completo</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                placeholder="Digite seu nome completo"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                placeholder="Digite seu e-mail"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Senha</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder="Crie uma senha (mín. 6 caracteres)"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmar Senha</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="Confirme sua senha"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-login">
                            Criar Conta
                        </button>

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
                    </form>

                    <div className="login-footer">
                        <p>
                            Já tem uma conta? <Link to="/">Fazer login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
