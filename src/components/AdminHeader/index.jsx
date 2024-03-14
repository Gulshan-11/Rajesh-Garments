import {Link, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const AdminHeader = props => {
  const navigate = useNavigate();

  const onClickLogout = () => {
    Cookies.remove('jwt_token');
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-mobile-logo-container">
          <img
            className="website-logo"
            src="https://res.cloudinary.com/dhsesp3bq/image/upload/v1690130873/images/Shop-logo_juxcnv.png"
            alt="website logo"
          />

          <button
            type="button"
            className="nav-mobile-btn"
            onClick={onClickLogout}
          >
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
              alt="nav logout"
              className="nav-bar-img"
            />
          </button>
        </div>

        <div className="nav-bar-large-container">
          <img
            className="website-logo"
            src="https://res.cloudinary.com/dhsesp3bq/image/upload/v1690130873/images/Shop-logo_juxcnv.png"
            alt="website logo"
          />
          <ul className="nav-menu">
          <li className="nav-menu-item">
              <Link to="/orders" className="nav-link">
                Orders
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link to="/add-product" className="nav-link">
                Add Product
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link to="/admin/all-products" className="nav-link">
                All Products
              </Link>
            </li>
          </ul>
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default AdminHeader
