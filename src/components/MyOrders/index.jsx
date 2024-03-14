import {useEffect, useState} from 'react'
import {getFirestore, collection, doc, getDoc} from 'firebase/firestore'
import {ThreeDots} from 'react-loader-spinner'
import html2pdf from 'html2pdf.js'
import ReactDOMServer from 'react-dom/server'
import InvoiceComponent from '../InvoiceComponent'
import Header from '../Header'
import EmptyOrderView from '../EmptyOrderView'
import OrderListView from '../OrderListView'
import {auth} from '../../firebase'
import './index.css'

const MyOrders = () => {
  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState()
  const [initialDataFetched, setInitialDataFetched] = useState(false)

  useEffect(() => {
    setLoading(true)

    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        // User is authenticated, fetch orders
        const firestore = getFirestore()
        const orderCollectionRef = collection(firestore, 'orderDetails')
        const orderDocumentRef = doc(orderCollectionRef, user.email)

        try {
          const orderDocumentSnapshot = await getDoc(orderDocumentRef)

          if (orderDocumentSnapshot.exists()) {
            const orderData = orderDocumentSnapshot.data()
            setOrderList(orderData.orders || [])
          } else {
            setOrderList([])
          }
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

  const generatePDF = async (order) => {
    try {
      console.log('Generating pdf..........')
      const Invoice = (
        <InvoiceComponent
          order={order}
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

  if (showEmptyView && !loading) {
    return (
      <>
        <Header />
        <div className="cart-container">
          <EmptyOrderView />
        </div>
      </>
    )
  }

  if (!initialDataFetched) {
    return (
      <>
        <Header />
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

  const getStatusColor = status => {
    switch (status) {
      case 'Order Shipped':
        return 'green'
      default:
        return 'red'
    }
  }

  return (
    <>
      <Header />
      <div className="order-container">
        <div className="order-content-container">
          <div className="heading-container">
            <h1 className="order-heading">My Orders</h1>
            <h2>Total Orders: {orderList.length}</h2>
          </div>
          {orderList.map((order, index) => (
            <div key={index}>
              <hr />
              <div className="orderDetails">
                <h3>
                  Ordered on{' '}
                  {new Date(order.timestamp.seconds * 1000).toLocaleString()}
                </h3>
                <h3>Total Amount: Rs. {order.totalPrice}</h3>
              </div>
              <h3>Transaction Type: {order.paymentType || "Not Found"}</h3>
              <OrderListView orderList={order.orderItems} />
              <div className="status">
                <button
                  type="button"
                  onClick={() =>
                    generatePDF(order)
                  }
                  disabled={order.status === 'Order Cancelled'}
                >
                  Download Invoice
                </button>
                <p>
                  {' '}
                  Status:{' '}
                  <span style={{color: getStatusColor(order.status)}}>
                    {order.status || 'Order Placed'}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default MyOrders
