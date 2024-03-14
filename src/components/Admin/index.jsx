import {useEffect, useState} from 'react'
import {
  getFirestore,
  collection,
  doc,
  writeBatch,
  getDocs,
  query,
} from 'firebase/firestore'
import {ThreeDots} from 'react-loader-spinner'
import html2pdf from 'html2pdf.js'
import ReactDOMServer from 'react-dom/server'
import swal from 'sweetalert'
import InvoiceComponent from '../InvoiceComponent'
import AdminHeader from '../AdminHeader'
import EmptyOrderView from '../EmptyOrderView'
import OrderListView from '../OrderListView'
import {auth} from '../../firebase'
import './index.css'

const Admin = () => {
  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState()
  const [initialDataFetched, setInitialDataFetched] = useState(false)
  // const [isShipping, setIsShipping] = useState(false)

  useEffect(() => {
    setLoading(true)

    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        // User is authenticated, fetch all orders
        const firestore = getFirestore()
        const orderCollectionRef = collection(firestore, 'orderDetails')
        const ordersQuery = query(orderCollectionRef)

        try {
          const ordersSnapshot = await getDocs(ordersQuery)

          const allOrders = []

          ordersSnapshot.forEach(orderDocument => {
            const orderData = orderDocument.data()
            allOrders.push(...(orderData.orders || []))
          })

          setOrderList(allOrders)
          setInitialDataFetched(true)
        } catch (error) {
          console.error('Error fetching order details:', error)
        }
      } else {
        // User is not authenticated, reset order list
        setOrderList([])
        setInitialDataFetched(true)
      }

      setLoading(false)
    })

    return () => unsubscribe() // Cleanup on unmount
  }, [])

  const showEmptyView = orderList.length === 0

  const generatePDF = async (orderItems, shippingAddress) => {
    try {
      console.log('Generating pdf..........')
      const invoiceDetails = orderItems
      const Invoice = (
        <InvoiceComponent
          invoiceDetails={invoiceDetails}
          shippingAddress={shippingAddress}
        />
      )
      const htmlString = ReactDOMServer.renderToString(Invoice)
      const opt = {
        margin: 0.5,
        filename: 'invoice.pdf',
        image: {type: 'jpeg', quality: 0.98},
        html2canvas: {scale: 2},
        jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'},
      }
      await html2pdf().set(opt).from(htmlString).save()
      // const pdfBlob = await html2pdf().set(opt).from(htmlString).outputPdf()
      console.log('PDF Generated successfully ')
    } catch (e) {
      console.error(e)
      // return null
    }
  }

  const changeStatus = async (id, updatedStatus) => {
    const firestore = getFirestore()
    const orderCollectionRef = collection(firestore, 'orderDetails')
    const ordersQuery = query(orderCollectionRef)

    try {
      const ordersSnapshot = await getDocs(ordersQuery)
      const batch = writeBatch(firestore)

      ordersSnapshot.forEach(orderDocument => {
        const orderData = orderDocument.data()
        const eachUserOrders = orderData.orders || []

        const updatedOrders = eachUserOrders.map(order => {
          if (order.id === id) {
            // Create a new object instead of modifying the existing one
            return {...order, status: updatedStatus}
          }
          return order
        })

        // Get a reference to the specific order document
        const orderDocRef = doc(orderCollectionRef, orderDocument.id)

        // Queue the update operation in the batch
        batch.update(orderDocRef, {
          orders: updatedOrders, // Update the orders field with the modified data
        })
      })

      // Commit the batch to Firestore
      await batch.commit()
      swal('Success', 'Status updated successfully', 'success')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error(error)
    }
  }

  if (showEmptyView && !loading) {
    return (
      <>
        <AdminHeader />
        <div className="cart-container">
          <EmptyOrderView />
        </div>
      </>
    )
  }

  if (!initialDataFetched || loading) {
    return (
      <>
        <AdminHeader />
        <div className="loader">
        <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#4fa94d"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
        </div>
      </>
    )
  }

  return (
    <>
      <AdminHeader />
      <div className="order-container">
        <div className="order-content-container">
          <h1 className="order-heading">
            All Orders <span>({orderList.length})</span>
          </h1>
          {orderList
            .slice()
            .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
            .map(order => (
              <div key={order.id}>
                <div className="orderDetails">
                  <h3>
                    Ordered on{' '}
                    {new Date(order.timestamp.seconds * 1000).toLocaleString()}
                  </h3>
                  <h3>Total Amount: Rs. {order.totalPrice}</h3>
                </div>
                <div>
                  <p>Ordered by: {order.shippingAddress.name}</p>
                  <p>Order Status: {order.status}</p>
                </div>
                <OrderListView orderList={order.orderItems} />
                <div className="status">
                  <button
                    type="button"
                    onClick={() =>
                      generatePDF(order.orderItems, order.shippingAddress)
                    }
                  >
                    Download Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => changeStatus(order.id, 'Order Shipped')}
                    disabled={
                      order.status === 'Order Shipped' ||
                      order.status === 'Order Completed' ||
                      order.status === 'Order Cancelled'
                    }
                    id={order.id}
                  >
                    {' '}
                    {order.status === 'Order Shipped' ||
                    order.status === 'Order Completed'
                      ? 'Order Shipped'
                      : 'Ship Order'}
                  </button>
                  <button
                    type="button"
                    onClick={() => changeStatus(order.id, 'Order Completed')}
                    disabled={
                      order.status === 'Order Completed' ||
                      order.status === 'Order Cancelled'
                    }
                    id={order.id}
                  >
                    {' '}
                    {order.status === 'Order Completed'
                      ? 'Order Completed'
                      : 'Complete Order'}
                  </button>
                  <button
                    type="button"
                    onClick={() => changeStatus(order.id, 'Order Cancelled')}
                    disabled={
                      order.status === 'Order Shipped' ||
                      order.status === 'Order Completed' ||
                      order.status === 'Order Cancelled'
                    }
                    id={order.id}
                  >
                    {' '}
                    {order.status === 'Order Cancelled'
                      ? 'Order Cancelled'
                      : 'Cancel Order'}
                  </button>
                </div>
                <hr />
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default Admin
