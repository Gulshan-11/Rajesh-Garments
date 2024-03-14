import './index.css'
import ReactPopup from '../ReactPopup'

const CartSummary = ({cartList}) => {
  let total = 0
  cartList.forEach(eachCartItem => {
    total += eachCartItem.selectedPrice * eachCartItem.quantity
  })

  return (
    <>
      <div className="cart-summary-container">
        <h1 className="order-total-value">
          <span className="order-total-label">Order Total:</span> Rs {total}/-
        </h1>
        <p className="total-items">{cartList.length} Items in cart</p>
        <ReactPopup total={total} items={cartList.length} />
      </div>
    </>
  )
}

export default CartSummary
