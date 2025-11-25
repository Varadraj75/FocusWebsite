import { useState } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Pencil, Check, X, GripHorizontal, Coffee, PieChart } from 'lucide-react';
import { useTimer } from '../../context/TimerContext';
import { useNavigate } from 'react-router-dom';

export default function TimerWidget() {
    const navigate = useNavigate();
    const {
        timers, breakTimer, mode,
        toggleTimer, toggleBreak, resetTimer, resetBreak,
        addTimer, deleteTimer, updateTimerTitle, switchMode
    } = useTimer();

    const [newSubject, setNewSubject] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    const handleAddTimer = (e) => {
        e.preventDefault();
        if (!newSubject.trim()) return;
        addTimer(newSubject);
        setNewSubject('');
    };

    const startEditing = (timer) => {
        setEditingId(timer.id);
        setEditTitle(timer.title);
    };

    const saveEdit = (id) => {
        if (!editTitle.trim()) return;
        updateTimerTitle(id, editTitle);
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
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="drag-handle cursor-move text-slate-400 hover:text-slate-600">
                        <GripHorizontal className="w-5 h-5" />
                    </div>
                    <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                        <button
                            onClick={() => switchMode('focus')}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${mode === 'focus' ? 'bg-white dark:bg-slate-600 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                        >
                            Focus
                        </button>
                        <button
                            onClick={() => switchMode('break')}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${mode === 'break' ? 'bg-white dark:bg-slate-600 shadow-sm text-amber-500' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                        >
                            Break
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/insights')}
                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                    title="View Insights"
                >
                    <PieChart className="w-5 h-5" />
                </button>
            </div>

            {mode === 'focus' ? (
                <>
                    <form onSubmit={handleAddTimer} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="New Subject..."
                            className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                        />
                        <button type="submit" className="p-2 bg-primary text-white rounded-md hover:bg-blue-600">
                            <Plus className="w-5 h-5" />
                        </button>
                    </form>

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
                                    {formatTime(timer.duration)}
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
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <Coffee className="w-16 h-16 text-amber-500 mb-4" />
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Time for a Break</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 text-center">Recharge your mind. You've earned it.</p>

                    <div className="text-6xl font-mono font-bold text-slate-800 dark:text-white mb-8">
                        {formatTime(breakTimer.duration)}
                    </div>

                    <div className="flex gap-4 w-full max-w-xs">
                        <button
                            onClick={toggleBreak}
                            className={`flex-1 flex items-center justify-center py-3 rounded-xl text-lg font-medium transition-colors ${breakTimer.isRunning
                                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300'
                                : 'bg-amber-500 text-white hover:bg-amber-600'
                                }`}
                        >
                            {breakTimer.isRunning ? 'Pause Break' : 'Start Break'}
                        </button>
                        <button
                            onClick={resetBreak}
                            className="p-3 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300"
                        >
                            <RotateCcw className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
