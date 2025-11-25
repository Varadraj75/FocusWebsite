import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useStudy } from './StudyContext';

const TimerContext = createContext();

export function useTimer() {
    return useContext(TimerContext);
}

const DEFAULT_SUBJECTS = ['Math', 'Physics', 'Chemistry', 'English', 'CS'];

export function TimerProvider({ children }) {
    const { logTime } = useStudy();

    // -- State --
    const [mode, setMode] = useState(() => localStorage.getItem('timer_mode') || 'focus');

    // Timers list
    const [timers, setTimers] = useState(() => {
        const saved = localStorage.getItem('timers_v2');
        if (saved) return JSON.parse(saved);
        return DEFAULT_SUBJECTS.map(sub => ({
            id: sub,
            title: sub,
            duration: 0, // Total accumulated seconds
            isRunning: false,
            lastTick: null // Timestamp of last update
        }));
    });

    // Break timer
    const [breakTimer, setBreakTimer] = useState(() => {
        const saved = localStorage.getItem('break_timer_v2');
        if (saved) return JSON.parse(saved);
        return {
            duration: 0,
            isRunning: false,
            lastTick: null
        };
    });

    // -- Refs for Interval --
    const timersRef = useRef(timers);
    const breakTimerRef = useRef(breakTimer);
    const modeRef = useRef(mode);

    // Sync refs with state
    useEffect(() => {
        timersRef.current = timers;
        localStorage.setItem('timers_v2', JSON.stringify(timers));
    }, [timers]);

    useEffect(() => {
        breakTimerRef.current = breakTimer;
        localStorage.setItem('break_timer_v2', JSON.stringify(breakTimer));
    }, [breakTimer]);

    useEffect(() => {
        modeRef.current = mode;
        localStorage.setItem('timer_mode', mode);
    }, [mode]);

    // -- Global Interval --
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();

            // Check Focus Timers
            // We iterate to find the running one.
            // Note: We use functional state update to ensure we have latest state without dependency issues if we were to use refs for everything.
            // But we are using refs for reading.

            const activeTimerIndex = timersRef.current.findIndex(t => t.isRunning);
            if (activeTimerIndex !== -1) {
                const activeTimer = timersRef.current[activeTimerIndex];

                logTime(activeTimer.title, 1, 'study');

                setTimers(prev => {
                    const newTimers = [...prev];
                    // Safety check to ensure we found it (though ref should match)
                    if (newTimers[activeTimerIndex]) {
                        newTimers[activeTimerIndex] = {
                            ...newTimers[activeTimerIndex],
                            duration: newTimers[activeTimerIndex].duration + 1,
                            lastTick: now
                        };
                    }
                    return newTimers;
                });
            }

            // Check Break Timer
            if (breakTimerRef.current.isRunning) {
                logTime('Break', 1, 'break');
                setBreakTimer(prev => ({
                    ...prev,
                    duration: prev.duration + 1,
                    lastTick: now
                }));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [logTime]);

    // -- Actions --

    const toggleTimer = useCallback((id) => {
        setTimers(prev => prev.map(t => {
            if (t.id === id) {
                return { ...t, isRunning: !t.isRunning, lastTick: Date.now() };
            }
            return { ...t, isRunning: false }; // Ensure only one runs
        }));
        // Pause break if focus starts
        setBreakTimer(prev => ({ ...prev, isRunning: false }));
        setMode('focus');
    }, []);

    const toggleBreak = useCallback(() => {
        setBreakTimer(prev => ({ ...prev, isRunning: !prev.isRunning, lastTick: Date.now() }));
        // Pause all focus timers
        setTimers(prev => prev.map(t => ({ ...t, isRunning: false })));
        setMode('break');
    }, []);

    const resetTimer = useCallback((id) => {
        setTimers(prev => prev.map(t =>
            t.id === id ? { ...t, duration: 0, isRunning: false, lastTick: null } : t
        ));
    }, []);

    const resetBreak = useCallback(() => {
        setBreakTimer(prev => ({ ...prev, duration: 0, isRunning: false, lastTick: null }));
    }, []);

    const addTimer = useCallback((title) => {
        setTimers(prev => [...prev, {
            id: Date.now().toString(),
            title,
            duration: 0,
            isRunning: false,
            lastTick: null
        }]);
    }, []);

    const deleteTimer = useCallback((id) => {
        setTimers(prev => prev.filter(t => t.id !== id));
    }, []);

    const updateTimerTitle = useCallback((id, newTitle) => {
        setTimers(prev => prev.map(t =>
            t.id === id ? { ...t, title: newTitle } : t
        ));
    }, []);

    const switchMode = useCallback((newMode) => {
        setMode(newMode);
        // Do NOT pause timers when switching modes.
        // The UI will update to show the relevant timer, but the background state persists.
    }, []);

    // -- Recovery Logic (On Mount) --
    // If we want to support "resume after refresh", we check lastTick.
    // For now, let's just ensure state is loaded. The simple state persistence handles "refresh" state (isRunning=true),
    // but the *time passed* while closed won't be accounted for unless we do diffing.
    // Given the user said "Timer resets... instead of continuing", simple persistence is the first big step.
    // Let's add simple diffing for robustness.

    useEffect(() => {
        const now = Date.now();

        // Recover Focus Timers
        setTimers(prev => prev.map(t => {
            if (t.isRunning && t.lastTick) {
                const diff = Math.floor((now - t.lastTick) / 1000);
                if (diff > 0 && diff < 86400) { // Sanity check: < 24 hours
                    // We should also log this "offline" time? 
                    // Maybe too complex for now. Let's just update the visual duration so it looks correct.
                    // And log it in one chunk?
                    logTime(t.title, diff, 'study');
                    return { ...t, duration: t.duration + diff, lastTick: now };
                }
            }
            return t;
        }));

        // Recover Break Timer
        setBreakTimer(prev => {
            if (prev.isRunning && prev.lastTick) {
                const diff = Math.floor((now - prev.lastTick) / 1000);
                if (diff > 0 && diff < 86400) {
                    logTime('Break', diff, 'break');
                    return { ...prev, duration: prev.duration + diff, lastTick: now };
                }
            }
            return prev;
        });
    }, []); // Run once on mount

    return (
        <TimerContext.Provider value={{
            timers,
            breakTimer,
            mode,
            toggleTimer,
            toggleBreak,
            resetTimer,
            resetBreak,
            addTimer,
            deleteTimer,
            updateTimerTitle,
            switchMode
        }}>
            {children}
        </TimerContext.Provider>
    );
}
