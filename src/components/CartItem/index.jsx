import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {AiFillCloseCircle} from 'react-icons/ai'
import './index.css'

const CartItem = ({cartItemId, cartItemDetails, cartList, setCartList}) => {
  const {title, brand, quantity, selectedPrice, imageUrl, selectedSize} = cartItemDetails

  const onClickDecrement = () => {
    const updatedCartList = cartList.map((item, index) => {
      // console.log(index,key)
        if (index === cartItemId) {
            // If the item is the kth item, decrement its quantity
            if(item.quantity !== 1) {  
              return {...item, quantity: item.quantity - 1}
            }
        }
        return item;
    });
    setCartList(updatedCartList)
      // Update local storage with updated cart data
      localStorage.setItem('cartItems', JSON.stringify(updatedCartList))
  }

  const onClickIncrement = () => {
    const updatedCartList = cartList.map((item, index) => {
      // console.log(index,key)
        if (index === cartItemId) {
            // If the item is the kth item, decrement its quantity
            if(item.quantity !== 1) {  
              return {...item, quantity: item.quantity + 1}
            }
        }
        return item;
    });
    setCartList(updatedCartList)
    // Update local storage with updated cart data
    localStorage.setItem('cartItems', JSON.stringify(updatedCartList))
  }

  const onRemoveCartItem = () => {
    const updatedCartList = [];
    for (let index = 0; index < cartList.length; index++) {
        const item = cartList[index];
        if (index !== cartItemId) {
            // If the index is not equal to cartItemId, add the item to the updatedCartList
            updatedCartList.push(item);
        }
    }

    setCartList(updatedCartList)
    // Update local storage with updated cart data
    localStorage.setItem('cartItems', JSON.stringify(updatedCartList))
  }

  const totalPrice = selectedPrice * quantity
  console.log(quantity)

  return (
    <li className="cart-item">
      <img className="cart-product-image" src={imageUrl} alt={title} />
      <div className="cart-item-details-container">
        <div className="cart-product-title-brand-container">
          <p className="cart-product-title">{title}</p>
          <p className="cart-product-brand">by {brand}</p>
        </div>
        <div className="size-contanier">
        <p>Size: {selectedSize}</p>
        </div>
        <div className='price-container cart-total-price'>
          <p> Rs {selectedPrice}/-</p>
        </div>
        <div className="cart-quantity-container">
          <button
            type="button"
            className="quantity-controller-button"
            onClick={onClickDecrement}
          >
            <BsDashSquare color="#52606D" size={12} />
          </button>
          <p className="cart-quantity">{quantity}</p>
          <button
            type="button"
            className="quantity-controller-button"
            onClick={onClickIncrement}
          >
            <BsPlusSquare color="#52606D" size={12} />
          </button>
        </div>
        <div className="total-price-remove-container">
          <p className="cart-total-price">Rs {totalPrice}/-</p>
        </div>
      </div>
      <button
        className="delete-button"
        type="button"
        onClick={onRemoveCartItem}
      >
        <AiFillCloseCircle color="#616E7C" size={20} />
      </button>
    </li>
  )
}

export default CartItem
