// import { useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import useAuthStore from "../auth/authStore"; // path to your Zustand store

const ProtectedRoute = ({ children }) => {
    const {user} = useAuthStore();
    if(!user){
        return <Navigate to="/login" replace />;
    }
    return children;
}
export default ProtectedRoute;