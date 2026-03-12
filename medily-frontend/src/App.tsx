import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import "./App.css";
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Add more routes as needed */}
        <Route path="/signup" element={<SignUp />} />

        <Route path="/doctordashboard" element={<DoctorDashboard />} />
        {/* <Route path="/dashboard" element={<DoctorMedicalFeed />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
