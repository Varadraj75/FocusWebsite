import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center space-x-2">
                    <LayoutDashboard className="w-6 h-6 text-primary" />
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">FocusDashboard</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300 border-l border-slate-200 dark:border-slate-700 pl-4">
                        <User className="w-4 h-4" />
                        <span className="truncate max-w-[150px]">{currentUser?.email}</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-1 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
