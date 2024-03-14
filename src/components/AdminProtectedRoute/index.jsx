import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';

const AdminProtectedRoute = ({ children }) => {
  const token = Cookie.get('jwt_token');
  const navigate = useNavigate();

  useEffect(() => {
    const userinfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!token) {
      console.log("token not found");
      navigate("/login");
    }
    else if (userinfo.role !== "admin") {
      console.log("Not an Admin user")
      navigate("/not-found");
    }
  }, [token, navigate]);

  return token ? children : null;
}

export default AdminProtectedRoute;
