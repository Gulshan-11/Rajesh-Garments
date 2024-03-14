import {Link, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const navigate = useNavigate();

  const onClickLogout = () => {
    Cookies.remove('jwt_token');
    localStorage.clear();
    navigate('/login');
  };

  const renderCartItemsCount = () => {
    const cartData = localStorage.getItem('cartItems')
    const cartList = cartData ? JSON.parse(cartData) : []

    const cartItemsCount = cartList.length
    // console.log(cartItemsCount)

    return (
      <>
        {cartItemsCount > 0 && (
          <span className="cart-count-badge">{cartItemsCount}</span>
        )}
      </>
    )
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-mobile-logo-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://res.cloudinary.com/dhsesp3bq/image/upload/v1690130873/images/Shop-logo_juxcnv.png"
              alt="website logo"
            />
          </Link>

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
          <Link to="/">
            <img
              className="website-logo"
              src="https://res.cloudinary.com/dhsesp3bq/image/upload/v1690130873/images/Shop-logo_juxcnv.png"
              alt="website logo"
            />
          </Link>
          <ul className="nav-menu">
            <li className="nav-menu-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>

            <li className="nav-menu-item">
              <Link to="/products" className="nav-link">
                Products
              </Link>
            </li>

            <li className="nav-menu-item">
              <Link to="/myorders" className="nav-link">
                My Orders
              </Link>
            </li>

            <li className="nav-menu-item">
              <Link to="/cart" className="nav-link">
                Cart {renderCartItemsCount()}
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link to="/mydetails" className="nav-link">
                Me
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
      <div className="nav-menu-mobile">
        <ul className="nav-menu-list-mobile">
          <li className="nav-menu-item-mobile">
            <Link to="/" className="nav-link">
              <p>Home</p>
            </Link>
          </li>

          <li className="nav-menu-item-mobile">
            <Link to="/products" className="nav-link">
              <p>Products</p>
            </Link>
          </li>
          <li className="nav-menu-item-mobile">
            <Link to="/myorders" className="nav-link">
              <p>My Orders</p>
            </Link>
          </li>
          <li className="nav-menu-item-mobile">
            <Link to="/cart" className="nav-link">
              <p>Cart</p>
              {renderCartItemsCount()}
            </Link>
          </li>
          <li className="nav-menu-item-mobile">
            <Link to="/mydetails" className="nav-link">
              <p>Me</p>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Header
