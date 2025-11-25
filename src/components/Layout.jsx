import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();



    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center space-x-8">
                    <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <LayoutDashboard className="w-6 h-6 text-primary" />
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">FocusDashboard</h1>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-1">
                        <Link
                            to="/dashboard"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-slate-100 dark:bg-slate-700 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/insights"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/insights' ? 'bg-slate-100 dark:bg-slate-700 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            Insights
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center space-x-4">


                    <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
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
