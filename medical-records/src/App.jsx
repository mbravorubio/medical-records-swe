
// src/App.jsx
// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PatientPage from "./pages/PatientPage";
import DoctorPage from "./pages/DoctorPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/patient" element={<PatientPage />} />
      <Route path="/doctor" element={<DoctorPage />} />
    </Routes>
  );
}

