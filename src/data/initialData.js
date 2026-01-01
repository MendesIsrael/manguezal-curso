import { v4 as uuidv4 } from 'uuid';

// Generate initial data for demonstration
export const generateInitialData = () => {
    const adminUser = {
        id: 'admin-1',
        email: 'admin@manguezal.com',
        password: 'admin123',
        name: 'Professor Administrador',
        type: 'admin',
        createdAt: new Date().toISOString()
    };

    const studentUser = {
        id: 'student-1',
        email: 'aluno@teste.com',
        password: 'aluno123',
        name: 'Aluno Teste',
        type: 'student',
        createdAt: new Date().toISOString()
    };

    const course1 = {
        id: uuidv4(),
        title: 'Ecossistema Manguezal',
        description: 'Aprenda sobre a rica biodiversidade e importância ecológica dos manguezais brasileiros.',
        thumbnail: null,
        duration: 40, // hours
        minGrade: 70,
        professorId: adminUser.id,
        professorName: 'Professor Administrador',
        isActive: true,
        createdAt: new Date().toISOString()
    };

    const modules = [
        {
            id: uuidv4(),
            courseId: course1.id,
            title: 'Introdução ao Manguezal',
            description: 'Conceitos básicos sobre o ecossistema manguezal',
            order: 1,
            createdAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            courseId: course1.id,
            title: 'Biodiversidade',
            description: 'Flora e fauna do manguezal',
            order: 2,
            createdAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            courseId: course1.id,
            title: 'Conservação e Preservação',
            description: 'Importância e estratégias de conservação',
            order: 3,
            createdAt: new Date().toISOString()
        }
    ];

    const videos = [
        {
            id: uuidv4(),
            moduleId: modules[0].id,
            courseId: course1.id,
            title: 'O que são Manguezais?',
            description: 'Uma introdução ao ecossistema manguezal e sua importância global.',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 15,
            order: 1,
            createdAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            moduleId: modules[0].id,
            courseId: course1.id,
            title: 'Distribuição Geográfica',
            description: 'Onde encontramos manguezais no Brasil e no mundo.',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 12,
            order: 2,
            createdAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            moduleId: modules[1].id,
            courseId: course1.id,
            title: 'Flora do Manguezal',
            description: 'Conheça as principais espécies de plantas do manguezal.',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 18,
            order: 1,
            createdAt: new Date().toISOString()
        }
    ];

    const pdfs = [
        {
            id: uuidv4(),
            moduleId: modules[0].id,
            courseId: course1.id,
            title: 'Apostila - Introdução ao Manguezal',
            description: 'Material didático completo sobre os conceitos básicos.',
            fileName: 'introducao-manguezal.pdf',
            fileSize: 2500000,
            order: 1,
            createdAt: new Date().toISOString()
        },
        {
            id: uuidv4(),
            moduleId: modules[1].id,
            courseId: course1.id,
            title: 'Guia de Identificação de Espécies',
            description: 'Guia ilustrado para identificar fauna e flora.',
            fileName: 'guia-especies.pdf',
            fileSize: 5000000,
            order: 1,
            createdAt: new Date().toISOString()
        }
    ];

    const exercises = [
        {
            id: uuidv4(),
            moduleId: modules[0].id,
            courseId: course1.id,
            title: 'Avaliação - Introdução ao Manguezal',
            description: 'Teste seus conhecimentos sobre os conceitos básicos.',
            questions: [
                {
                    id: uuidv4(),
                    type: 'multiple',
                    text: 'Qual é a principal característica que define um manguezal?',
                    options: [
                        { id: 'a', text: 'Presença de água salgada ou salobra' },
                        { id: 'b', text: 'Solo arenoso e seco' },
                        { id: 'c', text: 'Altitude elevada' },
                        { id: 'd', text: 'Clima frio' }
                    ],
                    correctAnswer: 'a',
                    points: 10
                },
                {
                    id: uuidv4(),
                    type: 'truefalse',
                    text: 'Os manguezais são encontrados apenas no Brasil.',
                    correctAnswer: false,
                    points: 10
                },
                {
                    id: uuidv4(),
                    type: 'multiple',
                    text: 'Qual a importância ecológica dos manguezais?',
                    options: [
                        { id: 'a', text: 'Apenas paisagística' },
                        { id: 'b', text: 'Berçário de espécies marinhas e proteção costeira' },
                        { id: 'c', text: 'Produção de madeira' },
                        { id: 'd', text: 'Nenhuma importância significativa' }
                    ],
                    correctAnswer: 'b',
                    points: 10
                }
            ],
            totalPoints: 30,
            order: 1,
            createdAt: new Date().toISOString()
        }
    ];

    const settings = {
        professorName: 'Professor Responsável',
        professorTitle: 'Doutor em Ciências Ambientais',
        institutionName: 'PROPEC/IFRJ',
        courseName: 'Curso Manguezal',
        certificateHeader: 'CERTIFICADO DE CONCLUSÃO',
        certificateBody: 'Certificamos que {nome} concluiu com aproveitamento o curso {curso}, com carga horária de {carga_horaria} horas.'
    };

    return {
        users: [adminUser, studentUser],
        courses: [course1],
        modules,
        videos,
        pdfs,
        images: [],
        exercises,
        comments: [],
        enrollments: [],
        grades: [],
        progress: [],
        notifications: [],
        certificates: [],
        settings
    };
};

export default generateInitialData;
