import OrderItem from '../OrderItem'
import './index.css'

const OrderListView = ({orderList}) => (
  <ul className="order-list">
    {orderList.map((eachOrderItem, index) => (
      <OrderItem key={index} orderItemDetails={eachOrderItem} />
    ))}
  </ul>
)

export default OrderListView
