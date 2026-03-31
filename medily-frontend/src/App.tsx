import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import "./App.css";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes */}
        <Route path="/doctordashboard" element={
          <ProtectedRoute allowedRole="DOCTOR">
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patientdashboard" element={
          <ProtectedRoute allowedRole="PATIENT">
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/pharmacydashboard" element={
          <ProtectedRoute allowedRole="PHARMACIST">
            <PharmacyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admindashboard" element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
