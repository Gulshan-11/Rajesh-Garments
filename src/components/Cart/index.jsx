import {useEffect, useState} from 'react'
import Header from '../Header'
import EmptyCartView from '../EmptyCartView'
import CartListView from '../CartListView'
import CartSummary from '../CartSummary'
import './index.css'

const Cart = () => {
  const [cartList, setCartList] = useState([])

  useEffect(() => {
    // Fetch cart data from local storage and set it to the state
    const existingCartData = JSON.parse(localStorage.getItem('cartItems')) || []
    setCartList(existingCartData)
  }, [])

  const removeAllCartItems = () => {
    // Clear the cart data from local storage and state
    localStorage.removeItem('cartItems')
    setCartList([])
  }

  const showEmptyView = cartList.length === 0

  return (
    <>
      <Header />
      <div className="cart-container">
        {showEmptyView ? (
          <EmptyCartView />
        ) : (
          <div className="cart-content-container">
            <h1 className="cart-heading">My Cart</h1>
            <button
              type="button"
              className="remove-all-btn"
              onClick={removeAllCartItems}
            >
              Remove All
            </button>
            <CartListView cartList={cartList} setCartList={setCartList} />
            <CartSummary cartList={cartList} />
          </div>
        )}
      </div>
    </>
  )
}

export default Cart
