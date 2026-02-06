// src/App.tsx
import React, { Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { PrivateRoute } from "./components/PrivateRoute";

// =========================
// Lazy loaded pages
// =========================

// Login
const LoginPage = React.lazy(() =>
  import("./pages/LoginPage").then((m) => ({ default: m.LoginPage }))
);

// Pets
const PetsPage = React.lazy(() =>
  import("./pages/PetsPage").then((m) => ({ default: m.PetsPage }))
);

const PetFormPage = React.lazy(() =>
  import("./pages/PetFormPage").then((m) => ({ default: m.PetFormPage }))
);

const PetDetailsPage = React.lazy(() =>
  import("./pages/PetDetailsPage").then((m) => ({ default: m.PetDetailsPage }))
);

// Tutores
const TutorsPage = React.lazy(() =>
  import("./pages/TutorsPage").then((m) => ({ default: m.TutorsPage }))
);

const TutorFormPage = React.lazy(() =>
  import("./pages/TutorFormPage").then((m) => ({ default: m.TutorFormPage }))
);

const TutorPetsPage = React.lazy(() =>
  import("./pages/TutorPetsPage").then((m) => ({ default: m.TutorPetsPage }))
);

// =========================
// App component
// =========================

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center text-slate-600">
              Carregando...
            </div>
          }
        >
          <Routes>
            {/* rota pública */}
            <Route path="/login" element={<LoginPage />} />

            {/* rotas protegidas */}
            <Route element={<PrivateRoute />}>
              {/* redireciona / para /pets */}
              <Route path="/" element={<Navigate to="/pets" replace />} />

              {/* Pets */}
              <Route
                path="/pets"
                element={
                  <Layout>
                    <PetsPage />
                  </Layout>
                }
              />
              <Route
                path="/pets/novo"
                element={
                  <Layout>
                    <PetFormPage />
                  </Layout>
                }
              />
              <Route
                path="/pets/:id"
                element={
                  <Layout>
                    <PetDetailsPage />
                  </Layout>
                }
              />
              <Route
                path="/pets/:id/editar"
                element={
                  <Layout>
                    <PetFormPage />
                  </Layout>
                }
              />

              {/* Tutores */}
              <Route
                path="/tutores"
                element={
                  <Layout>
                    <TutorsPage />
                  </Layout>
                }
              />
              <Route
                path="/tutores/novo"
                element={
                  <Layout>
                    <TutorFormPage />
                  </Layout>
                }
              />
              <Route
                path="/tutores/:id/editar"
                element={
                  <Layout>
                    <TutorFormPage />
                  </Layout>
                }
              />
              <Route
                path="/tutores/:id/pets"
                element={
                  <Layout>
                    <TutorPetsPage />
                  </Layout>
                }
              />
            </Route>

            {/* fallback: qualquer rota desconhecida → /pets */}
            <Route path="*" element={<Navigate to="/pets" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

// ⚠️ IMPORTANTE: default export para o main.tsx
export default App;
