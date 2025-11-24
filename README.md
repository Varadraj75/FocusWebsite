# Focus Study Dashboard

A distraction-free, motivating study dashboard for JEE/NEET aspirants. Built with React, Tailwind CSS, and Firebase.

## Features

- **Subject Timers**: Track study time for Math, Physics, Chemistry, etc.
- **To-Do List**: Manage daily tasks and goals.
- **YouTube Player**: Watch lectures without YouTube's distracting sidebar.
- **Notepad**: Quick notes with autosave and .txt download.
- **Calendar**: Monthly view with event tracking.
- **Dark Mode**: Toggle between light and dark themes.
- **Responsive**: Works on mobile and desktop.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Firebase Configuration (Optional)**
   - Create a project in [Firebase Console](https://console.firebase.google.com/).
   - Enable Authentication (Email/Password).
   - Create a `.env` file based on `.env.example` and add your config.
   - *Note: The app works with LocalStorage fallback if Firebase is not configured.*

3. **Run Locally**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Tech Stack

- React (Vite)
- Tailwind CSS
- Lucide React (Icons)
- Date-fns (Date manipulation)
- Firebase (Auth/Firestore)

## Credits

Designed for serious students to conquer their exams. Focus today, conquer tomorrow.
