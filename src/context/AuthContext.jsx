import { createContext, useContext } from 'react';
import useUsuario from '../hooks/useUsuario.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useUsuario();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
