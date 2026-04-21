import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Toast } from './components/ui/Toast';

/* Landing */
import { LandingPage } from './pages/LandingPage';

/* Auth */
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

/* Attendee */
import { AttendeeDashboard } from './pages/AttendeeDashboard';
import { MySchedulePage } from './pages/MySchedulePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { OrganizerRequestPage } from './pages/OrganizerRequestPage';
import { PaymentsPage } from './pages/PaymentsPage';

/* Organizer */
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { WorkshopFormPage } from './pages/WorkshopFormPage';
import { WorkshopDetailsPage } from './pages/WorkshopDetailsPage';
import { AttendeeManagementPage } from './pages/AttendeeManagementPage';

/* Manager */
import { ManagerDashboard } from './pages/ManagerDashboard';
import { WorkshopReviewPage } from './pages/WorkshopReviewPage';
import { AllWorkshopsPage } from './pages/AllWorkshopsPage';
import { UserManagementPage } from './pages/UserManagementPage';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ToastProvider>
          <Toast />
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Attendee */}
            <Route path="/dashboard" element={<ProtectedRoute><AttendeeDashboard /></ProtectedRoute>} />
            <Route path="/my-schedule" element={<ProtectedRoute><MySchedulePage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/organizer-request" element={<ProtectedRoute><OrganizerRequestPage /></ProtectedRoute>} />
            <Route path="/payments/:id" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />

            {/* Organizer */}
            <Route path="/organizer" element={<ProtectedRoute><OrganizerDashboard /></ProtectedRoute>} />
            <Route path="/workshops/create" element={<ProtectedRoute><WorkshopFormPage /></ProtectedRoute>} />
            <Route path="/workshops/:id/edit" element={<ProtectedRoute><WorkshopFormPage /></ProtectedRoute>} />
            <Route path="/workshops/:id" element={<ProtectedRoute><WorkshopDetailsPage /></ProtectedRoute>} />
            <Route path="/workshops/:id/attendees" element={<ProtectedRoute><AttendeeManagementPage /></ProtectedRoute>} />

            {/* Manager */}
            <Route path="/manager" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
            <Route path="/manager/reviews" element={<ProtectedRoute><WorkshopReviewPage /></ProtectedRoute>} />
            <Route path="/manager/workshops" element={<ProtectedRoute><AllWorkshopsPage /></ProtectedRoute>} />
            <Route path="/manager/users" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />

            {/* Default */}
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
