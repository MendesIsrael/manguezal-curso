import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import jsPDF from 'jspdf';

function StudentCertificate() {
    const { getStudentCertificates, courses, settings } = useData();
    const { user } = useAuth();
    const [downloading, setDownloading] = useState(false);

    const certificates = getStudentCertificates(user.id);

    const generatePDF = async (certificate) => {
        setDownloading(true);

        try {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            // Background
            doc.setFillColor(245, 245, 245);
            doc.rect(0, 0, 297, 210, 'F');

            // Border
            doc.setDrawColor(45, 90, 39);
            doc.setLineWidth(3);
            doc.rect(10, 10, 277, 190);
            doc.setLineWidth(1);
            doc.rect(15, 15, 267, 180);

            // Header decoration
            doc.setFillColor(45, 90, 39);
            doc.rect(15, 15, 267, 20, 'F');

            // Institution name
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(settings.institutionName || 'PROPEC/IFRJ', 148.5, 27, { align: 'center' });

            // Certificate title
            doc.setTextColor(45, 90, 39);
            doc.setFontSize(32);
            doc.setFont('helvetica', 'bold');
            doc.text('CERTIFICADO', 148.5, 55, { align: 'center' });

            // Subtitle
            doc.setFontSize(14);
            doc.setTextColor(100, 100, 100);
            doc.setFont('helvetica', 'normal');
            doc.text('de Conclusão de Curso', 148.5, 65, { align: 'center' });

            // Main text
            doc.setFontSize(12);
            doc.setTextColor(60, 60, 60);
            doc.text('Certificamos que', 148.5, 85, { align: 'center' });

            // Student name
            doc.setFontSize(24);
            doc.setTextColor(45, 90, 39);
            doc.setFont('helvetica', 'bold');
            doc.text(user.name, 148.5, 100, { align: 'center' });

            // Line under name
            doc.setDrawColor(45, 90, 39);
            doc.setLineWidth(0.5);
            const nameWidth = doc.getTextWidth(user.name);
            doc.line(148.5 - nameWidth / 2, 103, 148.5 + nameWidth / 2, 103);

            // Course completion text
            doc.setFontSize(12);
            doc.setTextColor(60, 60, 60);
            doc.setFont('helvetica', 'normal');
            doc.text('concluiu com êxito o curso', 148.5, 115, { align: 'center' });

            // Course name
            doc.setFontSize(18);
            doc.setTextColor(45, 90, 39);
            doc.setFont('helvetica', 'bold');
            doc.text(certificate.courseName, 148.5, 128, { align: 'center' });

            // Duration
            doc.setFontSize(12);
            doc.setTextColor(60, 60, 60);
            doc.setFont('helvetica', 'normal');
            doc.text(`com carga horária de ${certificate.duration} horas`, 148.5, 140, { align: 'center' });

            // Completion date
            const completionDate = new Date(certificate.issuedAt).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            doc.text(`Data de conclusão: ${completionDate}`, 148.5, 150, { align: 'center' });

            // Professor signature area
            doc.setDrawColor(100, 100, 100);
            doc.line(50, 175, 130, 175);
            doc.setFontSize(10);
            doc.text(certificate.professorName || settings.professorName, 90, 182, { align: 'center' });
            doc.text('Professor Responsável', 90, 188, { align: 'center' });

            // Validation code
            doc.line(167, 175, 247, 175);
            doc.text('Código de Validação', 207, 182, { align: 'center' });
            doc.setFont('helvetica', 'bold');
            doc.text(certificate.validationCode, 207, 188, { align: 'center' });

            // Footer decoration
            doc.setFillColor(45, 90, 39);
            doc.rect(15, 195, 267, 5, 'F');

            // Leaf emoji as decoration (simplified)
            doc.setFontSize(30);
            doc.text('🌿', 25, 50);
            doc.text('🌿', 262, 50);

            // Save PDF
            doc.save(`certificado-${certificate.courseName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Erro ao gerar o certificado. Tente novamente.');
        }

        setDownloading(false);
    };

    return (
        <>
            <header className="topbar">
                <div className="topbar-title">
                    <h1>Meus Certificados</h1>
                    <p>Baixe os certificados dos cursos concluídos</p>
                </div>
            </header>

            <div className="page-content">
                {certificates.length === 0 ? (
                    <div className="content-card">
                        <div className="content-card-body">
                            <div className="empty-state">
                                <div className="empty-state-icon">🎓</div>
                                <h3>Nenhum certificado disponível</h3>
                                <p>Complete todos os módulos e atinja a nota mínima para receber seu certificado</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="certificates-grid">
                        {certificates.map(certificate => {
                            const course = courses.find(c => c.id === certificate.courseId);
                            return (
                                <div key={certificate.id} className="certificate-card">
                                    <div className="certificate-preview">
                                        <div className="certificate-badge">🎓</div>
                                        <div className="certificate-stamp">APROVADO</div>
                                    </div>
                                    <div className="certificate-info">
                                        <h3>{certificate.courseName}</h3>
                                        <p>Carga horária: {certificate.duration}h</p>
                                        <p>Emitido em: {new Date(certificate.issuedAt).toLocaleDateString('pt-BR')}</p>
                                        <p className="validation-code">
                                            Código: <strong>{certificate.validationCode}</strong>
                                        </p>
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => generatePDF(certificate)}
                                        disabled={downloading}
                                    >
                                        {downloading ? 'Gerando...' : '📥 Baixar PDF'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Info about certificates */}
                <div className="content-card" style={{ marginTop: '2rem' }}>
                    <div className="content-card-header">
                        <h2>ℹ️ Como obter seu certificado</h2>
                    </div>
                    <div className="content-card-body">
                        <div className="certificate-requirements">
                            <div className="requirement-item">
                                <span className="requirement-icon">✅</span>
                                <div>
                                    <strong>Complete 100% do curso</strong>
                                    <p>Assista todos os vídeos e leia todos os materiais</p>
                                </div>
                            </div>
                            <div className="requirement-item">
                                <span className="requirement-icon">📊</span>
                                <div>
                                    <strong>Atinja a nota mínima</strong>
                                    <p>Obtenha pelo menos a nota mínima exigida nas avaliações</p>
                                </div>
                            </div>
                            <div className="requirement-item">
                                <span className="requirement-icon">🎓</span>
                                <div>
                                    <strong>Receba automaticamente</strong>
                                    <p>O certificado será liberado automaticamente após a conclusão</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default StudentCertificate;
