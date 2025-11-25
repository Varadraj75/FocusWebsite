import { useState, useEffect } from 'react';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths,
    isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X, GripHorizontal } from 'lucide-react';

export default function CalendarWidget() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState(() => {
        const saved = localStorage.getItem('calendar_events');
        return saved ? JSON.parse(saved) : {};
    });
    const [showEventInput, setShowEventInput] = useState(false);
    const [newEvent, setNewEvent] = useState('');

    useEffect(() => {
        localStorage.setItem('calendar_events', JSON.stringify(events));
    }, [events]);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');

    const addEvent = (e) => {
        e.preventDefault();
        if (!newEvent.trim()) return;

        setEvents(prev => ({
            ...prev,
            [formattedSelectedDate]: [...(prev[formattedSelectedDate] || []), newEvent]
        }));
        setNewEvent('');
        setShowEventInput(false);
    };

    const deleteEvent = (dateStr, index) => {
        setEvents(prev => {
            const dayEvents = [...(prev[dateStr] || [])];
            dayEvents.splice(index, 1);
            if (dayEvents.length === 0) {
                const newEvents = { ...prev };
                delete newEvents[dateStr];
                return newEvents;
            }
            return { ...prev, [dateStr]: dayEvents };
        });
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 h-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="drag-handle cursor-move text-slate-400 hover:text-slate-600">
                        <GripHorizontal className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-slate-500">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={`${d}-${i}`}>{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1 mb-6">
                {days.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const hasEvents = events[dateStr] && events[dateStr].length > 0;
                    const isSelected = isSameDay(day, selectedDate);

                    return (
                        <button
                            key={day.toString()}
                            onClick={() => setSelectedDate(day)}
                            className={`
                h-8 w-8 rounded-full flex items-center justify-center text-sm relative
                ${!isSameMonth(day, monthStart) ? 'text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}
                ${isToday(day) ? 'bg-blue-100 text-primary font-bold' : ''}
                ${isSelected ? 'bg-primary text-white hover:bg-primary' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}
              `}
                        >
                            {format(day, 'd')}
                            {hasEvents && !isSelected && (
                                <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full"></span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-slate-800 dark:text-white">
                        {isToday(selectedDate) ? 'Today' : format(selectedDate, 'MMM d')}
                    </h3>
                    <button
                        onClick={() => setShowEventInput(!showEventInput)}
                        className="text-primary text-sm hover:underline flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Add Event
                    </button>
                </div>

                {showEventInput && (
                    <form onSubmit={addEvent} className="mb-4 flex gap-2">
                        <input
                            type="text"
                            placeholder="Event name..."
                            className="flex-1 px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-white"
                            value={newEvent}
                            onChange={(e) => setNewEvent(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="px-3 py-1 bg-primary text-white rounded-md text-sm">Add</button>
                    </form>
                )}

                <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                    {(!events[formattedSelectedDate] || events[formattedSelectedDate].length === 0) && (
                        <p className="text-sm text-slate-400 italic">No events for this day.</p>
                    )}
                    {events[formattedSelectedDate]?.map((event, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-700/50 p-2 rounded">
                            <span className="text-slate-700 dark:text-slate-300">{event}</span>
                            <button
                                onClick={() => deleteEvent(formattedSelectedDate, idx)}
                                className="text-slate-400 hover:text-red-500"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
