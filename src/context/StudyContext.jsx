import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { startOfDay, format, isSameDay, subDays } from 'date-fns';

const StudyContext = createContext();

export function useStudy() {
    return useContext(StudyContext);
}

export function StudyProvider({ children }) {
    const [sessions, setSessions] = useState(() => {
        const saved = localStorage.getItem('study_sessions');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('study_sessions', JSON.stringify(sessions));
    }, [sessions]);

    const logTime = useCallback((subject, seconds, type = 'study') => {
        const today = new Date();
        const dateKey = format(today, 'yyyy-MM-dd');

        // We'll store sessions as aggregated chunks per day/subject to save space
        // Or we can just append a log entry. For "live" updates, we might want to update a counter.
        // However, to keep it simple and accurate, let's just update a "daily aggregate" object.

        setSessions(prev => {
            // Find if we have an entry for today and this subject
            // Actually, let's keep a list of daily records.
            // Structure: { date: '2023-10-27', subject: 'Math', type: 'study', duration: 120 }

            // But calling this every second is expensive if we clone the array.
            // Better: Update a "current day" object in a ref or separate state, and only persist occasionally?
            // Or just optimize the state update.

            // Let's try to find the entry for today/subject/type and increment it.
            const existingIndex = prev.findIndex(s =>
                s.date === dateKey && s.subject === subject && s.type === type
            );

            if (existingIndex >= 0) {
                const newSessions = [...prev];
                newSessions[existingIndex] = {
                    ...newSessions[existingIndex],
                    duration: newSessions[existingIndex].duration + seconds
                };
                return newSessions;
            } else {
                return [...prev, {
                    date: dateKey,
                    subject,
                    type,
                    duration: seconds
                }];
            }
        });
    }, []);

    const getDailyStats = useCallback(() => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const todaySessions = sessions.filter(s => s.date === today);

        const totalStudy = todaySessions
            .filter(s => s.type === 'study')
            .reduce((acc, curr) => acc + curr.duration, 0);

        const totalBreak = todaySessions
            .filter(s => s.type === 'break')
            .reduce((acc, curr) => acc + curr.duration, 0);

        const subjectDistribution = todaySessions
            .filter(s => s.type === 'study')
            .reduce((acc, curr) => {
                acc[curr.subject] = (acc[curr.subject] || 0) + curr.duration;
                return acc;
            }, {});

        return { totalStudy, totalBreak, subjectDistribution };
    }, [sessions]);

    const getWeeklyStats = useCallback(() => {
        const stats = [];
        for (let i = 6; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const dateKey = format(date, 'yyyy-MM-dd');
            const daySessions = sessions.filter(s => s.date === dateKey);

            const studyTime = daySessions
                .filter(s => s.type === 'study')
                .reduce((acc, curr) => acc + curr.duration, 0);

            stats.push({
                date: format(date, 'MMM dd'),
                studyTime: Math.round(studyTime / 60) // in minutes
            });
        }
        return stats;
    }, [sessions]);

    return (
        <StudyContext.Provider value={{ sessions, logTime, getDailyStats, getWeeklyStats }}>
            {children}
        </StudyContext.Provider>
    );
}
