import { useState } from 'react';
import { Youtube, Minimize2, Maximize2, GripHorizontal } from 'lucide-react';

export default function YoutubeWidget() {
    const [url, setUrl] = useState('');
    const [videoId, setVideoId] = useState('');
    const [isMini, setIsMini] = useState(false);

    const extractVideoId = (inputUrl) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = inputUrl.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleLoad = (e) => {
        e.preventDefault();
        const id = extractVideoId(url);
        if (id) {
            setVideoId(id);
        } else {
            alert('Invalid YouTube URL');
        }
    };

    return (
        <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col ${isMini ? 'h-auto' : 'h-full'}`}>
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="drag-handle cursor-move text-slate-400 hover:text-slate-600">
                        <GripHorizontal className="w-5 h-5" />
                    </div>
                    <Youtube className="w-5 h-5 text-red-600" />
                    <h2 className="font-semibold text-slate-800 dark:text-white">Study Player</h2>
                </div>
                <button onClick={() => setIsMini(!isMini)} className="text-slate-400 hover:text-slate-600">
                    {isMini ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
            </div>

            {!videoId ? (
                <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-slate-500 mb-4">Paste a YouTube link to watch lectures distraction-free.</p>
                    <form onSubmit={handleLoad} className="w-full flex gap-2">
                        <input
                            type="text"
                            placeholder="https://youtube.com/watch?v=..."
                            className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                            Load
                        </button>
                    </form>
                </div>
            ) : (
                <div className="flex-1 flex flex-col">
                    <div className="relative pt-[56.25%] bg-black">
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                        <span className="text-xs text-slate-500">Playing now</span>
                        <button onClick={() => { setVideoId(''); setUrl(''); }} className="text-xs text-red-500 hover:underline">
                            Clear Video
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
