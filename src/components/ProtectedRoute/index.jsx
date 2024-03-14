import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const token = Cookie.get('jwt_token');
  const navigate = useNavigate();

  useEffect(() => {
    const userinfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log(userinfo)
    if (!token) {
      console.log("token not found");
      navigate("/login");
    }
    else if (userinfo.role !== "customer") {
      console.log("Not a customer")
      navigate("/admin");
    }
  }, [token, navigate]);

  return token ? children : null;
}

export default ProtectedRoute;
