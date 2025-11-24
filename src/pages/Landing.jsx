import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, BookOpen } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
                    <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-7xl">
                        Focus today, <span className="text-primary">conquer tomorrow.</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700 dark:text-slate-300">
                        The ultimate distraction-free study dashboard for JEE/NEET aspirants.
                        Track your subjects, manage tasks, and stay motivated.
                    </p>
                    <div className="mt-10 flex justify-center gap-x-6">
                        <Link
                            to="/signup"
                            className="group inline-flex items-center justify-center rounded-full py-3 px-8 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-primary text-white hover:bg-blue-600 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                        >
                            Start Studying Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        <Link
                            to="/login"
                            className="group inline-flex items-center justify-center rounded-full py-3 px-8 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 active:text-slate-900 focus-visible:outline-white dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-20 bg-slate-50 dark:bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Subject Timers</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Track time for Math, Physics, Chemistry and more. Visualize your effort.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6">
                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Task Management</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Simple to-do lists to keep track of chapters and daily goals.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                                <BookOpen className="w-6 h-6 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Study Tools</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Built-in notepad, YouTube player for lectures, and calendar.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quote Section */}
            <div className="py-20 text-center">
                <blockquote className="text-2xl font-medium italic text-slate-900 dark:text-white max-w-3xl mx-auto px-4">
                    "One chapter a day keeps the fear away."
                </blockquote>
            </div>
        </div>
    );
}
