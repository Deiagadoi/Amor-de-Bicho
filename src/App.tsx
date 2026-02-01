import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { PetsPage } from "./pages/PetsPage";
import { TutorsPage } from "./pages/TutorsPage";
import { PetDetailsPage } from "./pages/PetDetailsPage";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<PetsPage />} />
            <Route path="/pets" element={<PetsPage />} />
            <Route path="/pets/:id" element={<PetDetailsPage />} /> 
            <Route path="/tutores" element={<TutorsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
