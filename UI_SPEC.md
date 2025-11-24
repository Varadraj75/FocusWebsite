# UI Specification: Focus Study Dashboard

## Overview
A distraction-free study dashboard designed for JEE/NEET aspirants. The UI focuses on minimalism, motivation, and utility.

## Screens

### 1. Landing Page (`/`)
- **Hero Section**: Large motivational text ("Focus today, conquer tomorrow"). Call to action buttons for Login/Signup.
- **Features Grid**: 3-column layout highlighting Timers, Tasks, and Tools.
- **Quote Section**: Simple, elegant typography for daily motivation.

### 2. Authentication (`/login`, `/signup`)
- **Layout**: Centered card on a clean background.
- **Form**: Email/Password inputs with validation.
- **Feedback**: Error messages in red alert boxes.
- **Navigation**: Links to switch between Login and Signup.

### 3. Dashboard (`/dashboard`)
- **Layout**: Responsive Grid (1 column on mobile, 3 columns on desktop).
- **Header**: Logo, Dark Mode toggle, User Email, Logout.
- **Left Column (Main)**:
    - **Timer Widget**: Grid of subject cards. Active timers highlighted.
    - **Tools Row**: YouTube Player (left) and Notepad (right).
- **Right Column (Sidebar)**:
    - **Calendar**: Monthly view with event dots.
    - **Todo List**: Vertical list with checkboxes.

## Components

### Layout
- **Header**: Sticky top bar.
- **Main**: Content area with max-width constraint.

### Widgets
- **TimerWidget**:
    - Cards for each subject.
    - Start/Pause/Reset controls.
    - Visual indicator for running state.
- **TodoWidget**:
    - Input field with "Add" button.
    - List items with strikethrough on completion.
    - Hover actions (Delete).
- **YoutubeWidget**:
    - URL Input state.
    - Video Player state (iframe).
    - Mini/Maxi toggle.
- **NotepadWidget**:
    - Simple textarea.
    - Download icon button.
- **CalendarWidget**:
    - Month navigation.
    - Day grid.
    - Selected day view with event list.

## User Flow
1. **Visitor** lands on Home.
2. Clicks **"Start Studying Now"**.
3. **Sign Up** with email/password.
4. Redirected to **Dashboard**.
5. **Dashboard**:
    - Starts a timer for "Math".
    - Adds a todo "Solve 20 problems".
    - Pastes a YouTube lecture link.
    - Takes notes in Notepad.
6. **Logout** saves state (to LocalStorage/Firebase).

## Design System
- **Colors**:
    - Primary: Blue-500 (`#3b82f6`)
    - Secondary: Emerald-500 (`#10b981`)
    - Dark Bg: Slate-900 (`#0f172a`)
    - Light Bg: Slate-50 (`#f8fafc`)
- **Typography**: Inter (Sans-serif).
- **Dark Mode**: Fully supported via Tailwind `dark:` classes.
