import { useState, useEffect } from 'react';
import { Download, Save, GripHorizontal } from 'lucide-react';

export default function NotepadWidget() {
    const [note, setNote] = useState(() => localStorage.getItem('notepad') || '');

    useEffect(() => {
        localStorage.setItem('notepad', note);
    }, [note]);

    const downloadNote = () => {
        const element = document.createElement("a");
        const file = new Blob([note], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "study-notes.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 h-full flex flex-col overflow-auto">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="drag-handle cursor-move text-slate-400 hover:text-slate-600">
                        <GripHorizontal className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Notepad</h2>
                </div>
                <button onClick={downloadNote} className="text-slate-500 hover:text-primary" title="Download .txt">
                    <Download className="w-5 h-5" />
                </button>
            </div>
            <textarea
                className="flex-1 w-full resize-none bg-slate-50 dark:bg-slate-900 border-0 rounded-lg p-4 text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-primary focus:outline-none text-sm leading-relaxed"
                placeholder="Write your thoughts, formulas, or quick notes here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
            ></textarea>
            <div className="mt-2 text-xs text-slate-400 text-right">
                Autosaved
            </div>
        </div>
    );
}
