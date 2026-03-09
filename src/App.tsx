// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar      from "./components/Navbar";
import HomePage    from "./pages/HomePage";
import LoginPage   from "./pages/LoginPage";
import SignupPage  from "./pages/SignupPage";
import UpgradePage from "./pages/UpgradePage";
import "./styles/globals.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter> 
        <Navbar />
        <Routes>
          <Route path="/"        element={<HomePage />} />
          <Route path="/login"   element={<LoginPage />} />
          <Route path="/signup"  element={<SignupPage />} />
          <Route path="/upgrade" element={<UpgradePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}