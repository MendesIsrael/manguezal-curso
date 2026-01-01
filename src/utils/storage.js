// Storage utilities for localStorage persistence

const STORAGE_PREFIX = 'manguezal_';

export const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(STORAGE_PREFIX + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    set: (key, value) => {
        try {
            localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(STORAGE_PREFIX + key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    clear: () => {
        try {
            Object.keys(localStorage)
                .filter(key => key.startsWith(STORAGE_PREFIX))
                .forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Storage keys
export const STORAGE_KEYS = {
    USERS: 'users',
    COURSES: 'courses',
    MODULES: 'modules',
    LESSONS: 'lessons',
    VIDEOS: 'videos',
    PDFS: 'pdfs',
    IMAGES: 'images',
    EXERCISES: 'exercises',
    COMMENTS: 'comments',
    ENROLLMENTS: 'enrollments',
    GRADES: 'grades',
    PROGRESS: 'progress',
    NOTIFICATIONS: 'notifications',
    CERTIFICATES: 'certificates',
    SETTINGS: 'settings'
};

export default storage;
