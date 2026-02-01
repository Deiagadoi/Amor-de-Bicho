import { useAuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const { isAuthenticated, loading, login, logout } = useAuthContext();
  return { isAuthenticated, loading, login, logout };
};