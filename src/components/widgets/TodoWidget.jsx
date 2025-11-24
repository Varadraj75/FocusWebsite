import { useState, useEffect } from 'react';
import { Check, Trash2, Plus, Square, GripHorizontal } from 'lucide-react';

export default function TodoWidget() {
    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem('todos');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, text: 'Complete Math Chapter 5', completed: false },
            { id: 2, text: 'Review Physics Notes', completed: true },
        ];
    });
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
        setNewTodo('');
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                <div className="drag-handle cursor-move text-slate-400 hover:text-slate-600">
                    <GripHorizontal className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">To-Do List</h2>
            </div>

            <form onSubmit={addTodo} className="flex gap-2 mb-4 flex-shrink-0">
                <input
                    type="text"
                    placeholder="Add a task..."
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button type="submit" className="p-2 bg-primary text-white rounded-lg hover:bg-blue-600">
                    <Plus className="w-5 h-5" />
                </button>
            </form>

            <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar pr-2">
                {todos.length === 0 && (
                    <p className="text-center text-slate-400 text-sm py-4">No tasks yet. Stay focused!</p>
                )}
                {todos.map(todo => (
                    <div key={todo.id} className="flex items-center gap-3 group">
                        <button
                            onClick={() => toggleTodo(todo.id)}
                            className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${todo.completed
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-slate-300 dark:border-slate-500 text-transparent hover:border-primary'
                                }`}
                        >
                            <Check className="w-3.5 h-3.5" />
                        </button>
                        <span className={`flex-1 text-sm ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                            {todo.text}
                        </span>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
