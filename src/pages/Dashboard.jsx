import { useState, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import TimerWidget from '../components/widgets/TimerWidget';
import TodoWidget from '../components/widgets/TodoWidget';
import YoutubeWidget from '../components/widgets/YoutubeWidget';
import NotepadWidget from '../components/widgets/NotepadWidget';
import CalendarWidget from '../components/widgets/CalendarWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_LAYOUTS = {
    lg: [
        { i: 'timer', x: 0, y: 0, w: 8, h: 4 },
        { i: 'youtube', x: 8, y: 0, w: 4, h: 4 },
        { i: 'notepad', x: 0, y: 4, w: 6, h: 4 },
        { i: 'calendar', x: 6, y: 4, w: 3, h: 4 },
        { i: 'todo', x: 9, y: 4, w: 3, h: 4 }
    ],
    md: [
        { i: 'timer', x: 0, y: 0, w: 6, h: 4 },
        { i: 'youtube', x: 6, y: 0, w: 4, h: 4 },
        { i: 'notepad', x: 0, y: 4, w: 5, h: 4 },
        { i: 'calendar', x: 5, y: 4, w: 5, h: 4 },
        { i: 'todo', x: 0, y: 8, w: 10, h: 4 }
    ],
    sm: [
        { i: 'timer', x: 0, y: 0, w: 6, h: 4 },
        { i: 'youtube', x: 0, y: 4, w: 6, h: 4 },
        { i: 'notepad', x: 0, y: 8, w: 6, h: 4 },
        { i: 'calendar', x: 0, y: 12, w: 6, h: 4 },
        { i: 'todo', x: 0, y: 16, w: 6, h: 4 }
    ]
};

export default function Dashboard() {
    const [layouts, setLayouts] = useState(() => {
        const saved = localStorage.getItem('dashboard_layout');
        return saved ? JSON.parse(saved) : DEFAULT_LAYOUTS;
    });

    const onLayoutChange = useCallback((layout, allLayouts) => {
        setLayouts(allLayouts);
        localStorage.setItem('dashboard_layout', JSON.stringify(allLayouts));
    }, []);

    return (
        <div className="mb-8">
            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={100}
                onLayoutChange={onLayoutChange}
                isDraggable={true}
                isResizable={true}
                margin={[24, 24]}
                containerPadding={[0, 0]}
                draggableHandle=".drag-handle"
                compactType={null}
                preventCollision={true}
            >
                <div key="timer"><TimerWidget /></div>
                <div key="youtube"><YoutubeWidget /></div>
                <div key="notepad"><NotepadWidget /></div>
                <div key="calendar"><CalendarWidget /></div>
                <div key="todo"><TodoWidget /></div>
            </ResponsiveGridLayout>
        </div>
    );
}
