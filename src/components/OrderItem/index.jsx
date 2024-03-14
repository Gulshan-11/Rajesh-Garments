import './index.css'

const OrderItem = ({orderItemDetails}) => {
  const {title, brand, quantity, selectedPrice, imageUrl, selectedSize} = orderItemDetails

  const totalPrice = selectedPrice * quantity

  return (
    <li className="order-item">
      <img className="order-product-image" src={imageUrl} alt={title} />
      <div className="order-item-details-container">
        <div className="order-product-title-brand-container">
          <p className="order-product-title">{title}</p>
          <p className="order-product-brand">by {brand}</p>
        </div>
        <div className="order-quantity-container">
          <p>Size: {selectedSize}</p>
          <p className="">Quantity: {quantity}</p>
        </div>
        <div className="total-price-remove-container">
          <p className="order-total-price">Rs {totalPrice}/-</p>
        </div>
      </div>
    </li>
  )
}

export default OrderItem
