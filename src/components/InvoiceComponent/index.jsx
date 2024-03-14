import './index.css'

const InvoiceComponent = ({order}) => {
  const totalAmount = order.orderItems.reduce(
    (acc, item) => acc + item.selectedPrice * item.quantity,
    0,
  )
  console.log(order)

  return (
    <div
      style={{fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#333'}}
    >
      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <h2>Rajesh Garments</h2>
        <p>123 Clothing Street, City, Zip Code</p>
      </div>
      <p>Invoice Details</p>
      <p>Order ID: {order.id}</p>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{borderBottom: '1px solid #ccc'}}>
            <th style={{textAlign: 'left' }}>Title</th>
            <th style={{textAlign: 'left' }}>Brand</th>
            <th style={{textAlign: 'left' }}>Category</th>
            <th style={{textAlign: 'left' }}>Size</th>
            <th style={{textAlign: 'left' }}>Price</th>
            <th style={{textAlign: 'left' }}>Quantity</th>
            <th style={{textAlign: 'left' }}>Rating</th>
            <th style={{textAlign: 'left' }}>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item, index) => (
            <tr key={index} style={{borderBottom: '1px solid #ccc'}}>
              <td>{item.title}</td>
              <td>{item.brand || 'N/A'}</td>
              <td>{item.category || 'N/A'}</td>
              <td>{item.selectedSize}</td>
              <td>Rs {item.selectedPrice}\-</td>
              <td>{item.quantity}</td>
              <td>{item.rating}</td>
              <td>
                Rs {item.selectedPrice * item.quantity}\-
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="6" style={{padding: '8px 0', textAlign: 'right'}}>
              <strong>Total Amount:</strong>
            </td>
            <td colSpan="6" style={{padding: '8px 0', textAlign: 'left'}}>
              <strong>Rs {totalAmount}\-</strong>
            </td>
          </tr>
        </tbody>
      </table>
       <br />
       <br />
        <table>
          <tbody>
            <tr>
              <td><strong>Shipping Address:</strong></td>
              <td>{order.shippingAddress.name}</td>
            </tr>
            <tr>
              <td></td>
              <td>{order.shippingAddress.address}</td>
            </tr>
            <tr>
              <td></td>
              <td>{order.shippingAddress.city}</td>
            </tr>
            <tr>
              <td></td>
              <td>{order.shippingAddress.state}</td>
            </tr>
            <tr>
              <td></td>
              <td>{order.shippingAddress.zipCode}</td>
            </tr>
            <tr>
              <td><strong>Transaction Details:</strong></td>
              <td></td>
            </tr>
            <tr>
              <td>Payment Type:</td>
              <td>{order.paymentType}</td>
            </tr>
            <tr>
              <td>Payment Id:</td>
              <td>{order.transactionId}</td>
            </tr>
          </tbody>
        </table>

    </div>
  )
}

export default InvoiceComponent
