import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { generateInitialData } from '../data/initialData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({
        courses: [],
        modules: [],
        videos: [],
        pdfs: [],
        images: [],
        exercises: [],
        comments: [],
        enrollments: [],
        grades: [],
        progress: [],
        notifications: [],
        certificates: [],
        settings: {}
    });

    // Initialize data from localStorage or use initial data
    useEffect(() => {
        const initializeData = () => {
            const storedCourses = storage.get(STORAGE_KEYS.COURSES);

            if (!storedCourses) {
                // First time: load initial data
                const initialData = generateInitialData();

                Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
                    const dataKey = key.toLowerCase();
                    if (initialData[dataKey]) {
                        storage.set(storageKey, initialData[dataKey]);
                    }
                });

                setData({
                    courses: initialData.courses || [],
                    modules: initialData.modules || [],
                    videos: initialData.videos || [],
                    pdfs: initialData.pdfs || [],
                    images: initialData.images || [],
                    exercises: initialData.exercises || [],
                    comments: initialData.comments || [],
                    enrollments: initialData.enrollments || [],
                    grades: initialData.grades || [],
                    progress: initialData.progress || [],
                    notifications: initialData.notifications || [],
                    certificates: initialData.certificates || [],
                    settings: initialData.settings || {}
                });
            } else {
                // Load from localStorage
                setData({
                    courses: storage.get(STORAGE_KEYS.COURSES) || [],
                    modules: storage.get(STORAGE_KEYS.MODULES) || [],
                    videos: storage.get(STORAGE_KEYS.VIDEOS) || [],
                    pdfs: storage.get(STORAGE_KEYS.PDFS) || [],
                    images: storage.get(STORAGE_KEYS.IMAGES) || [],
                    exercises: storage.get(STORAGE_KEYS.EXERCISES) || [],
                    comments: storage.get(STORAGE_KEYS.COMMENTS) || [],
                    enrollments: storage.get(STORAGE_KEYS.ENROLLMENTS) || [],
                    grades: storage.get(STORAGE_KEYS.GRADES) || [],
                    progress: storage.get(STORAGE_KEYS.PROGRESS) || [],
                    notifications: storage.get(STORAGE_KEYS.NOTIFICATIONS) || [],
                    certificates: storage.get(STORAGE_KEYS.CERTIFICATES) || [],
                    settings: storage.get(STORAGE_KEYS.SETTINGS) || {}
                });
            }

            setIsLoading(false);
        };

        initializeData();
    }, []);

    // Generic update function with persistence
    const updateData = useCallback((key, updater) => {
        setData(prev => {
            const newValue = typeof updater === 'function' ? updater(prev[key]) : updater;
            const storageKey = STORAGE_KEYS[key.toUpperCase()];
            if (storageKey) {
                storage.set(storageKey, newValue);
            }
            return { ...prev, [key]: newValue };
        });
    }, []);

    // ============ COURSE OPERATIONS ============
    const addCourse = useCallback((courseData) => {
        const newCourse = {
            id: uuidv4(),
            ...courseData,
            createdAt: new Date().toISOString()
        };
        updateData('courses', prev => [...prev, newCourse]);
        return newCourse;
    }, [updateData]);

    const updateCourse = useCallback((courseId, courseData) => {
        updateData('courses', prev =>
            prev.map(c => c.id === courseId ? { ...c, ...courseData, updatedAt: new Date().toISOString() } : c)
        );
    }, [updateData]);

    const deleteCourse = useCallback((courseId) => {
        updateData('courses', prev => prev.filter(c => c.id !== courseId));
        // Also delete related modules
        updateData('modules', prev => prev.filter(m => m.courseId !== courseId));
    }, [updateData]);

    // ============ MODULE OPERATIONS ============
    const addModule = useCallback((moduleData) => {
        const newModule = {
            id: uuidv4(),
            ...moduleData,
            createdAt: new Date().toISOString()
        };
        updateData('modules', prev => [...prev, newModule]);
        return newModule;
    }, [updateData]);

    const updateModule = useCallback((moduleId, moduleData) => {
        updateData('modules', prev =>
            prev.map(m => m.id === moduleId ? { ...m, ...moduleData, updatedAt: new Date().toISOString() } : m)
        );
    }, [updateData]);

    const deleteModule = useCallback((moduleId) => {
        updateData('modules', prev => prev.filter(m => m.id !== moduleId));
    }, [updateData]);

    // ============ VIDEO OPERATIONS ============
    const addVideo = useCallback((videoData) => {
        const newVideo = {
            id: uuidv4(),
            ...videoData,
            createdAt: new Date().toISOString()
        };
        updateData('videos', prev => [...prev, newVideo]);
        return newVideo;
    }, [updateData]);

    const updateVideo = useCallback((videoId, videoData) => {
        updateData('videos', prev =>
            prev.map(v => v.id === videoId ? { ...v, ...videoData, updatedAt: new Date().toISOString() } : v)
        );
    }, [updateData]);

    const deleteVideo = useCallback((videoId) => {
        updateData('videos', prev => prev.filter(v => v.id !== videoId));
    }, [updateData]);

    // ============ PDF OPERATIONS ============
    const addPdf = useCallback((pdfData) => {
        const newPdf = {
            id: uuidv4(),
            ...pdfData,
            createdAt: new Date().toISOString()
        };
        updateData('pdfs', prev => [...prev, newPdf]);
        return newPdf;
    }, [updateData]);

    const updatePdf = useCallback((pdfId, pdfData) => {
        updateData('pdfs', prev =>
            prev.map(p => p.id === pdfId ? { ...p, ...pdfData, updatedAt: new Date().toISOString() } : p)
        );
    }, [updateData]);

    const deletePdf = useCallback((pdfId) => {
        updateData('pdfs', prev => prev.filter(p => p.id !== pdfId));
    }, [updateData]);

    // ============ IMAGE OPERATIONS ============
    const addImage = useCallback((imageData) => {
        const newImage = {
            id: uuidv4(),
            ...imageData,
            createdAt: new Date().toISOString()
        };
        updateData('images', prev => [...prev, newImage]);
        return newImage;
    }, [updateData]);

    const deleteImage = useCallback((imageId) => {
        updateData('images', prev => prev.filter(i => i.id !== imageId));
    }, [updateData]);

    // ============ EXERCISE OPERATIONS ============
    const addExercise = useCallback((exerciseData) => {
        const newExercise = {
            id: uuidv4(),
            ...exerciseData,
            createdAt: new Date().toISOString()
        };
        updateData('exercises', prev => [...prev, newExercise]);
        return newExercise;
    }, [updateData]);

    const updateExercise = useCallback((exerciseId, exerciseData) => {
        updateData('exercises', prev =>
            prev.map(e => e.id === exerciseId ? { ...e, ...exerciseData, updatedAt: new Date().toISOString() } : e)
        );
    }, [updateData]);

    const deleteExercise = useCallback((exerciseId) => {
        updateData('exercises', prev => prev.filter(e => e.id !== exerciseId));
    }, [updateData]);

    // ============ COMMENT OPERATIONS ============
    const addComment = useCallback((commentData) => {
        const newComment = {
            id: uuidv4(),
            ...commentData,
            isPinned: false,
            isResolved: false,
            createdAt: new Date().toISOString()
        };
        updateData('comments', prev => [...prev, newComment]);

        // Create notification for replies
        if (commentData.parentId) {
            const parentComment = data.comments.find(c => c.id === commentData.parentId);
            if (parentComment && parentComment.userId !== commentData.userId) {
                addNotification({
                    userId: parentComment.userId,
                    type: 'comment_reply',
                    title: 'Nova resposta ao seu comentário',
                    message: `${commentData.authorName} respondeu ao seu comentário`,
                    referenceId: commentData.contentId,
                    referenceType: commentData.contentType
                });
            }
        }

        return newComment;
    }, [updateData, data.comments]);

    const updateComment = useCallback((commentId, commentData) => {
        updateData('comments', prev =>
            prev.map(c => c.id === commentId ? { ...c, ...commentData, updatedAt: new Date().toISOString() } : c)
        );
    }, [updateData]);

    const deleteComment = useCallback((commentId) => {
        updateData('comments', prev => prev.filter(c => c.id !== commentId));
    }, [updateData]);

    const pinComment = useCallback((commentId, isPinned) => {
        updateComment(commentId, { isPinned });
    }, [updateComment]);

    const resolveComment = useCallback((commentId, isResolved) => {
        updateComment(commentId, { isResolved });
    }, [updateComment]);

    // ============ ENROLLMENT OPERATIONS ============
    const enrollStudent = useCallback((userId, courseId) => {
        const existingEnrollment = data.enrollments.find(
            e => e.userId === userId && e.courseId === courseId
        );

        if (existingEnrollment) {
            return existingEnrollment;
        }

        const newEnrollment = {
            id: uuidv4(),
            userId,
            courseId,
            enrolledAt: new Date().toISOString(),
            completedAt: null,
            status: 'active'
        };
        updateData('enrollments', prev => [...prev, newEnrollment]);

        // Initialize progress
        const course = data.courses.find(c => c.id === courseId);
        const courseModules = data.modules.filter(m => m.courseId === courseId);

        courseModules.forEach(module => {
            const moduleVideos = data.videos.filter(v => v.moduleId === module.id);
            const moduleExercises = data.exercises.filter(e => e.moduleId === module.id);

            moduleVideos.forEach(video => {
                addProgress(userId, courseId, module.id, video.id, 'video');
            });

            moduleExercises.forEach(exercise => {
                addProgress(userId, courseId, module.id, exercise.id, 'exercise');
            });
        });

        return newEnrollment;
    }, [updateData, data.enrollments, data.courses, data.modules, data.videos, data.exercises]);

    const getStudentEnrollments = useCallback((userId) => {
        return data.enrollments.filter(e => e.userId === userId);
    }, [data.enrollments]);

    // ============ PROGRESS OPERATIONS ============
    const addProgress = useCallback((userId, courseId, moduleId, contentId, contentType) => {
        const existingProgress = data.progress.find(
            p => p.userId === userId && p.contentId === contentId
        );

        if (existingProgress) return existingProgress;

        const newProgress = {
            id: uuidv4(),
            userId,
            courseId,
            moduleId,
            contentId,
            contentType,
            completed: false,
            completedAt: null,
            createdAt: new Date().toISOString()
        };
        updateData('progress', prev => [...prev, newProgress]);
        return newProgress;
    }, [updateData, data.progress]);

    const markAsCompleted = useCallback((userId, contentId) => {
        updateData('progress', prev =>
            prev.map(p => p.userId === userId && p.contentId === contentId
                ? { ...p, completed: true, completedAt: new Date().toISOString() }
                : p
            )
        );
        checkCourseCompletion(userId);
    }, [updateData]);

    const getCourseProgress = useCallback((userId, courseId) => {
        const courseProgress = data.progress.filter(
            p => p.userId === userId && p.courseId === courseId
        );
        const completed = courseProgress.filter(p => p.completed).length;
        const total = courseProgress.length;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }, [data.progress]);

    // ============ GRADES OPERATIONS ============
    const submitGrade = useCallback((userId, exerciseId, answers, score, totalPoints) => {
        const exercise = data.exercises.find(e => e.id === exerciseId);

        const newGrade = {
            id: uuidv4(),
            userId,
            exerciseId,
            courseId: exercise?.courseId,
            moduleId: exercise?.moduleId,
            answers,
            score,
            totalPoints,
            percentage: Math.round((score / totalPoints) * 100),
            submittedAt: new Date().toISOString()
        };
        updateData('grades', prev => [...prev, newGrade]);

        // Mark exercise as completed in progress
        markAsCompleted(userId, exerciseId);

        return newGrade;
    }, [updateData, data.exercises, markAsCompleted]);

    const getStudentGrades = useCallback((userId, courseId = null) => {
        return data.grades.filter(g =>
            g.userId === userId && (courseId ? g.courseId === courseId : true)
        );
    }, [data.grades]);

    const getCourseAverageGrade = useCallback((userId, courseId) => {
        const courseGrades = getStudentGrades(userId, courseId);
        if (courseGrades.length === 0) return 0;
        const totalPercentage = courseGrades.reduce((sum, g) => sum + g.percentage, 0);
        return Math.round(totalPercentage / courseGrades.length);
    }, [getStudentGrades]);

    // ============ NOTIFICATION OPERATIONS ============
    const addNotification = useCallback((notificationData) => {
        const newNotification = {
            id: uuidv4(),
            ...notificationData,
            isRead: false,
            createdAt: new Date().toISOString()
        };
        updateData('notifications', prev => [...prev, newNotification]);
        return newNotification;
    }, [updateData]);

    const markNotificationAsRead = useCallback((notificationId) => {
        updateData('notifications', prev =>
            prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
    }, [updateData]);

    const getUnreadNotifications = useCallback((userId) => {
        return data.notifications.filter(n => n.userId === userId && !n.isRead);
    }, [data.notifications]);

    // ============ CERTIFICATE OPERATIONS ============
    const checkCourseCompletion = useCallback((userId) => {
        data.enrollments
            .filter(e => e.userId === userId && e.status === 'active')
            .forEach(enrollment => {
                const course = data.courses.find(c => c.id === enrollment.courseId);
                if (!course) return;

                const progress = getCourseProgress(userId, enrollment.courseId);
                const averageGrade = getCourseAverageGrade(userId, enrollment.courseId);

                if (progress === 100 && averageGrade >= course.minGrade) {
                    // Check if certificate already exists
                    const existingCert = data.certificates.find(
                        c => c.userId === userId && c.courseId === enrollment.courseId
                    );

                    if (!existingCert) {
                        generateCertificate(userId, enrollment.courseId);
                    }
                }
            });
    }, [data.enrollments, data.courses, data.certificates, getCourseProgress, getCourseAverageGrade]);

    const generateCertificate = useCallback((userId, courseId) => {
        const course = data.courses.find(c => c.id === courseId);
        const validationCode = `CERT-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

        const newCertificate = {
            id: uuidv4(),
            userId,
            courseId,
            courseName: course?.title,
            duration: course?.duration,
            professorName: course?.professorName || data.settings.professorName,
            validationCode,
            issuedAt: new Date().toISOString()
        };

        updateData('certificates', prev => [...prev, newCertificate]);

        // Notify user
        addNotification({
            userId,
            type: 'certificate_available',
            title: 'Certificado Disponível!',
            message: `Parabéns! Seu certificado do curso "${course?.title}" está disponível para download.`,
            referenceId: courseId,
            referenceType: 'certificate'
        });

        return newCertificate;
    }, [updateData, data.courses, data.settings, addNotification]);

    const getStudentCertificates = useCallback((userId) => {
        return data.certificates.filter(c => c.userId === userId);
    }, [data.certificates]);

    // ============ SETTINGS OPERATIONS ============
    const updateSettings = useCallback((settingsData) => {
        updateData('settings', prev => ({ ...prev, ...settingsData }));
    }, [updateData]);

    // ============ HELPER FUNCTIONS ============
    const getModulesByCourse = useCallback((courseId) => {
        return data.modules
            .filter(m => m.courseId === courseId)
            .sort((a, b) => a.order - b.order);
    }, [data.modules]);

    const getVideosByModule = useCallback((moduleId) => {
        return data.videos
            .filter(v => v.moduleId === moduleId)
            .sort((a, b) => a.order - b.order);
    }, [data.videos]);

    const getPdfsByModule = useCallback((moduleId) => {
        return data.pdfs
            .filter(p => p.moduleId === moduleId)
            .sort((a, b) => a.order - b.order);
    }, [data.pdfs]);

    const getExercisesByModule = useCallback((moduleId) => {
        return data.exercises
            .filter(e => e.moduleId === moduleId)
            .sort((a, b) => a.order - b.order);
    }, [data.exercises]);

    const getCommentsByContent = useCallback((contentId, contentType) => {
        return data.comments
            .filter(c => c.contentId === contentId && c.contentType === contentType)
            .sort((a, b) => {
                // Pinned comments first
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                // Then by date (newest first)
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
    }, [data.comments]);

    const value = {
        isLoading,
        ...data,

        // Course operations
        addCourse,
        updateCourse,
        deleteCourse,

        // Module operations
        addModule,
        updateModule,
        deleteModule,
        getModulesByCourse,

        // Video operations
        addVideo,
        updateVideo,
        deleteVideo,
        getVideosByModule,

        // PDF operations
        addPdf,
        updatePdf,
        deletePdf,
        getPdfsByModule,

        // Image operations
        addImage,
        deleteImage,

        // Exercise operations
        addExercise,
        updateExercise,
        deleteExercise,
        getExercisesByModule,

        // Comment operations
        addComment,
        updateComment,
        deleteComment,
        pinComment,
        resolveComment,
        getCommentsByContent,

        // Enrollment operations
        enrollStudent,
        getStudentEnrollments,

        // Progress operations
        addProgress,
        markAsCompleted,
        getCourseProgress,

        // Grade operations
        submitGrade,
        getStudentGrades,
        getCourseAverageGrade,

        // Notification operations
        addNotification,
        markNotificationAsRead,
        getUnreadNotifications,

        // Certificate operations
        generateCertificate,
        getStudentCertificates,
        checkCourseCompletion,

        // Settings
        updateSettings
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}

export default DataContext;
