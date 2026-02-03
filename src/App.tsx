import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { PetsPage } from "./pages/PetsPage";
import { TutorsPage } from "./pages/TutorsPage";
import { PetDetailsPage } from "./pages/PetDetailsPage";
import { PetFormPage } from "./pages/PetFormPage";
import { TutorFormPage } from "./pages/TutorFormPage";
import { TutorPetsPage } from "./pages/TutorPetsPage";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas protegidas */}
          <Route element={<ProtectedRoute />}>
            {/* Home = lista de pets */}
            <Route path="/" element={<PetsPage />} />

            {/* Pets */}
            <Route path="/pets" element={<PetsPage />} />
            <Route path="/pets/novo" element={<PetFormPage />} />
            <Route path="/pets/:id" element={<PetDetailsPage />} />
            <Route path="/pets/:id/editar" element={<PetFormPage />} />

            {/* Tutores */}
            <Route path="/tutores" element={<TutorsPage />} />
            <Route path="/tutores/novo" element={<TutorFormPage />} />
            <Route path="/tutores/:id/editar" element={<TutorFormPage />} />
            <Route path="/tutores/:id/pets" element={<TutorPetsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
