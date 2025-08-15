import { Navigate, Outlet } from 'react-router-dom';

const AuthenticationGuard = () => {
    const isAuthenticated = localStorage.getItem('access_token'); // Checking JWT instead of user object
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default AuthenticationGuard;
