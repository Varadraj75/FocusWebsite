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
            startTime: null, // Timestamp when timer started
            startDuration: 0, // Duration at the moment of start
            lastTick: null // Timestamp of last update (for logging)
        }));
    });

    // Break timer
    const [breakTimer, setBreakTimer] = useState(() => {
        const saved = localStorage.getItem('break_timer_v2');
        if (saved) return JSON.parse(saved);
        return {
            duration: 0,
            isRunning: false,
            startTime: null,
            startDuration: 0,
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
            const activeTimerIndex = timersRef.current.findIndex(t => t.isRunning);
            if (activeTimerIndex !== -1) {
                const activeTimer = timersRef.current[activeTimerIndex];

                // Calculate elapsed time since start
                // duration = startDuration + (now - startTime)
                const elapsedSinceStart = Math.floor((now - activeTimer.startTime) / 1000);
                const newDuration = activeTimer.startDuration + elapsedSinceStart;

                // Calculate delta for logging (time passed since last tick)
                // If lastTick is null (just started), delta is roughly 0 or 1s, but we log based on diff
                // Actually, for logging, we should log the diff between now and lastTick
                const lastTick = activeTimer.lastTick || activeTimer.startTime;
                const deltaSeconds = Math.floor((now - lastTick) / 1000);

                if (deltaSeconds > 0) {
                    logTime(activeTimer.title, deltaSeconds, 'study');

                    setTimers(prev => {
                        const newTimers = [...prev];
                        if (newTimers[activeTimerIndex]) {
                            newTimers[activeTimerIndex] = {
                                ...newTimers[activeTimerIndex],
                                duration: newDuration,
                                lastTick: now
                            };
                        }
                        return newTimers;
                    });
                }
            }

            // Check Break Timer
            if (breakTimerRef.current.isRunning) {
                const activeBreak = breakTimerRef.current;

                const elapsedSinceStart = Math.floor((now - activeBreak.startTime) / 1000);
                const newDuration = activeBreak.startDuration + elapsedSinceStart;

                const lastTick = activeBreak.lastTick || activeBreak.startTime;
                const deltaSeconds = Math.floor((now - lastTick) / 1000);

                if (deltaSeconds > 0) {
                    logTime('Break', deltaSeconds, 'break');

                    setBreakTimer(prev => ({
                        ...prev,
                        duration: newDuration,
                        lastTick: now
                    }));
                }
            }
        }, 100); // Check every 100ms for smoother updates

        return () => clearInterval(interval);
    }, [logTime]);

    // -- Actions --

    const toggleTimer = useCallback((id) => {
        setTimers(prev => prev.map(t => {
            if (t.id === id) {
                const now = Date.now();
                if (t.isRunning) {
                    // Pause: Clear startTime, keep duration
                    return { ...t, isRunning: false, startTime: null, lastTick: null };
                } else {
                    // Start: Set startTime, snapshot current duration
                    return {
                        ...t,
                        isRunning: true,
                        startTime: now,
                        startDuration: t.duration,
                        lastTick: now
                    };
                }
            }
            // Ensure only one runs
            if (t.isRunning) {
                return { ...t, isRunning: false, startTime: null, lastTick: null };
            }
            return t;
        }));
        // Pause break if focus starts
        setBreakTimer(prev => {
            if (prev.isRunning) {
                return { ...prev, isRunning: false, startTime: null, lastTick: null };
            }
            return prev;
        });
        setMode('focus');
    }, []);

    const toggleBreak = useCallback(() => {
        setBreakTimer(prev => {
            const now = Date.now();
            if (prev.isRunning) {
                return { ...prev, isRunning: false, startTime: null, lastTick: null };
            } else {
                return {
                    ...prev,
                    isRunning: true,
                    startTime: now,
                    startDuration: prev.duration,
                    lastTick: now
                };
            }
        });
        // Pause all focus timers
        setTimers(prev => prev.map(t => {
            if (t.isRunning) {
                return { ...t, isRunning: false, startTime: null, lastTick: null };
            }
            return t;
        }));
        setMode('break');
    }, []);

    const resetTimer = useCallback((id) => {
        setTimers(prev => prev.map(t =>
            t.id === id ? {
                ...t,
                duration: 0,
                isRunning: false,
                startTime: null,
                startDuration: 0,
                lastTick: null
            } : t
        ));
    }, []);

    const resetBreak = useCallback(() => {
        setBreakTimer(prev => ({
            ...prev,
            duration: 0,
            isRunning: false,
            startTime: null,
            startDuration: 0,
            lastTick: null
        }));
    }, []);

    const addTimer = useCallback((title) => {
        setTimers(prev => [...prev, {
            id: Date.now().toString(),
            title,
            duration: 0,
            isRunning: false,
            startTime: null,
            startDuration: 0,
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
    }, []);

    // -- Recovery Logic (On Mount) --
    // With timestamp logic, we just need to ensure that if we load a running timer from localStorage,
    // we update its duration based on the elapsed time since it was saved (or rather, since startTime).
    // The state initialization already loads 'startTime'.
    // We just need to trigger an immediate update or let the interval handle it.
    // However, if the interval takes 1s to fire, we might see a jump.
    // Let's do a quick sync on mount.

    useEffect(() => {
        const now = Date.now();

        // Recover Focus Timers
        setTimers(prev => prev.map(t => {
            if (t.isRunning && t.startTime) {
                const elapsedSinceStart = Math.floor((now - t.startTime) / 1000);
                const newDuration = t.startDuration + elapsedSinceStart;

                // We also need to log the time that passed while the app was closed/inactive
                // The lastTick gives us when we last updated.
                const lastTick = t.lastTick || t.startTime;
                const delta = Math.floor((now - lastTick) / 1000);

                if (delta > 0 && delta < 86400) {
                    logTime(t.title, delta, 'study');
                    return { ...t, duration: newDuration, lastTick: now };
                }
            }
            return t;
        }));

        // Recover Break Timer
        setBreakTimer(prev => {
            if (prev.isRunning && prev.startTime) {
                const elapsedSinceStart = Math.floor((now - prev.startTime) / 1000);
                const newDuration = prev.startDuration + elapsedSinceStart;

                const lastTick = prev.lastTick || prev.startTime;
                const delta = Math.floor((now - lastTick) / 1000);

                if (delta > 0 && delta < 86400) {
                    logTime('Break', delta, 'break');
                    return { ...prev, duration: newDuration, lastTick: now };
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
