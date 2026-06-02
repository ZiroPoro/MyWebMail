import { Route, Routes } from 'react-router';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AboutPage from './Pages/AboutPage/AboutPage';
import AdminPage from './Pages/AdminPage/AdminPage';
import LoginPage from './Pages/LoginPage/LoginPage';
import MainPage from './Pages/MainPage/MainPage';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/Login" element={<LoginPage />} />
      <Route path="/About" element={<AboutPage />} />
      <Route
        path="/WebMail"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
