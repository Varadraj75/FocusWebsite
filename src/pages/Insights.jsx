import { useStudy } from '../context/StudyContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Clock, Coffee, BookOpen } from 'lucide-react';

export default function Insights() {
    const { getDailyStats, getWeeklyStats } = useStudy();
    const { totalStudy, totalBreak, subjectDistribution } = getDailyStats();
    const weeklyStatsRaw = getWeeklyStats();
    const weeklyStats = weeklyStatsRaw.map(day => ({
        ...day,
        studyTime: Number((day.studyTime / 60).toFixed(2)) // Convert minutes to hours
    }));

    const formatTime = (seconds) => {
        return `${(seconds / 3600).toFixed(2)}h`;
    };

    const pieData = Object.entries(subjectDistribution)
        .map(([name, value]) => ({
            name,
            value: Number((value / 3600).toFixed(2)) // hours
        }))
        .filter(item => item.value > 0); // Filter out zero values

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const barData = [
        { name: 'Study', time: Number((totalStudy / 3600).toFixed(2)) },
        { name: 'Break', time: Number((totalBreak / 3600).toFixed(2)) }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Daily Insights</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track your productivity and study habits</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Study Time</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{formatTime(totalStudy)}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                            <Coffee className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Break Time</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{formatTime(totalBreak)}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Most Studied</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                                {pieData.length > 0 ? pieData.sort((a, b) => b.value - a.value)[0].name : 'N/A'}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Subject Distribution */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Subject Distribution (Hours)</h3>
                    <div className="h-[300px] w-full">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}h`}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value}h`, 'Time']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">
                                No study data yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Study vs Break */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Study vs Break (Hours)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                                <Tooltip formatter={(value) => [`${value}h`, 'Time']} />
                                <Bar dataKey="time" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Weekly Progress */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Weekly Progress (Hours)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <LineChart data={weeklyStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                                <Tooltip formatter={(value) => [`${value}h`, 'Study Time']} />
                                <Legend />
                                <Line type="monotone" dataKey="studyTime" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
