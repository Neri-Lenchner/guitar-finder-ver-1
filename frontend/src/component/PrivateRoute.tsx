import { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

interface PrivateRouteProps {
    child: JSX.Element;
}

function PrivateRoute({ child }: PrivateRouteProps): JSX.Element {
    const user = authService.getLoggedInUser();
    return user ? child : <Navigate to="/login" replace />;
}

export default PrivateRoute;
