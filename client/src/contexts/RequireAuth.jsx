// Garante que as rotas filhas sejam acessíveis apenas depois do login
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoutes = () => {
    const { user } = useAuth();

    // Se o usuário não estiver logado, direciona para a rota de login
    if (!user) return <Navigate to="/login" />;

    // Usuário logado
    return <Outlet />;
}

export default ProtectedRoutes;