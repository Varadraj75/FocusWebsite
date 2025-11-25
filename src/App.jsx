import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import { StudyProvider } from './context/StudyContext';
import { TimerProvider } from './context/TimerContext';
import Insights from './pages/Insights';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <PrivateRoute>
            <Layout>
              <Insights />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}



function App() {
  return (
    <Router>
      <AuthProvider>
        <StudyProvider>
          <TimerProvider>
            <AppRoutes />
          </TimerProvider>
        </StudyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
