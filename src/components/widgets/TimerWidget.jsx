import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Pencil, Check, X, GripHorizontal } from 'lucide-react';

const DEFAULT_SUBJECTS = ['Math', 'Physics', 'Chemistry', 'English', 'CS'];

export default function TimerWidget() {
    const [timers, setTimers] = useState(() => {
        const saved = localStorage.getItem('timers');
        if (saved) return JSON.parse(saved);
        return DEFAULT_SUBJECTS.map(sub => ({
            id: sub,
            title: sub,
            time: 0,
            isRunning: false
        }));
    });

    const [newSubject, setNewSubject] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    useEffect(() => {
        localStorage.setItem('timers', JSON.stringify(timers));
    }, [timers]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimers(prevTimers => prevTimers.map(timer => {
                if (timer.isRunning) {
                    return { ...timer, time: timer.time + 1 };
                }
                return timer;
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const toggleTimer = (id) => {
        setTimers(prev => prev.map(t =>
            t.id === id ? { ...t, isRunning: !t.isRunning } : t
        ));
    };

    const resetTimer = (id) => {
        setTimers(prev => prev.map(t =>
            t.id === id ? { ...t, time: 0, isRunning: false } : t
        ));
    };

    const deleteTimer = (id) => {
        setTimers(prev => prev.filter(t => t.id !== id));
    };

    const addTimer = (e) => {
        e.preventDefault();
        if (!newSubject.trim()) return;
        setTimers(prev => [...prev, {
            id: Date.now().toString(),
            title: newSubject,
            time: 0,
            isRunning: false
        }]);
        setNewSubject('');
    };

    const startEditing = (timer) => {
        setEditingId(timer.id);
        setEditTitle(timer.title);
    };

    const saveEdit = (id) => {
        if (!editTitle.trim()) return;
        setTimers(prev => prev.map(t =>
            t.id === id ? { ...t, title: editTitle } : t
        ));
        setEditingId(null);
        setEditTitle('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="drag-handle cursor-move text-slate-400 hover:text-slate-600">
                        <GripHorizontal className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Subject Timers</h2>
                </div>
                <form onSubmit={addTimer} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="New Subject..."
                        className="px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                    />
                    <button type="submit" className="p-1 bg-primary text-white rounded-md hover:bg-blue-600">
                        <Plus className="w-5 h-5" />
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1 custom-scrollbar pr-2">
                {timers.map(timer => (
                    <div key={timer.id} className={`p-4 rounded-xl border ${timer.isRunning ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                            {editingId === timer.id ? (
                                <div className="flex items-center gap-2 flex-1 mr-2">
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                                        autoFocus
                                    />
                                    <button onClick={() => saveEdit(timer.id)} className="text-green-500 hover:text-green-600">
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button onClick={cancelEdit} className="text-red-500 hover:text-red-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h3 className="font-medium text-slate-900 dark:text-white truncate flex-1">{timer.title}</h3>
                                    <div className="flex gap-1">
                                        <button onClick={() => startEditing(timer)} className="text-slate-400 hover:text-blue-500">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => deleteTimer(timer.id)} className="text-slate-400 hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="text-2xl font-mono font-bold text-slate-800 dark:text-slate-200 mb-4">
                            {formatTime(timer.time)}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => toggleTimer(timer.id)}
                                className={`flex-1 flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-colors ${timer.isRunning
                                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
                                    : 'bg-primary text-white hover:bg-blue-600'
                                    }`}
                            >
                                {timer.isRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                                {timer.isRunning ? 'Pause' : 'Start'}
                            </button>
                            <button
                                onClick={() => resetTimer(timer.id)}
                                className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {timers.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 italic">
                    "Time is what we want most, but what we use worst." - Add a subject to start.
                </div>
            )}
        </div>
    );
}
