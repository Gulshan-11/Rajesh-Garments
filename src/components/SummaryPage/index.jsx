import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import html2pdf from "html2pdf.js";
import ReactDOMServer from "react-dom/server";
import InvoiceComponent from "../InvoiceComponent";
import { auth } from "../../firebase";
import "./index.css";
import swal from "sweetalert";

const SummaryPage = (props) => {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const { total, items } = props;

  useEffect(() => {
    emailjs.init("RCt2qZO52k0nwVovW"); // Initialize EmailJS with your user ID
  }, []);

  const generatePDF = async (newOrder) => {
    try {
      console.log("Generating pdf..........");
      const invoiceDetails = JSON.parse(localStorage.getItem("cartItems"));
      const Invoice = (
        <InvoiceComponent
          orderId={newOrder.id}
          invoiceDetails={invoiceDetails}
          shippingAddress={shippingAddress}
        />
      );
      const htmlString = ReactDOMServer.renderToString(Invoice);
      const opt = {
        margin: 0.5,
        filename: "invoice.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(htmlString).save();
      console.log("PDF Generated successfully ");
    } catch (e) {
      console.error(e);
    }
  };

  const navigate = useNavigate();

  const loadScript = async (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (total) => {
    if (
      shippingAddress.name === "" ||
      shippingAddress.address === "" ||
      shippingAddress.city === "" ||
      shippingAddress.state === "" ||
      shippingAddress.zipCode === "" ||
      paymentType === ""
    ) {
      swal("Warning", "Please fill all the fields");
      return;
    }
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      swal("warning", "Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: "INR",
      amount: total * 100,
      Image:
        "https://res.cloudinary.com/dhsesp3bq/image/upload/v1690130873/images/Shop-logo_juxcnv.png",
      handler: function (response) {
        orderPlaced(response.razorpay_payment_id);
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const orderPlaced = async (transaction_id) => {
    const orderData = JSON.parse(localStorage.getItem("cartItems"));
    const user = auth.currentUser;
    if (
      shippingAddress.name === "" ||
      shippingAddress.address === "" ||
      shippingAddress.city === "" ||
      shippingAddress.state === "" ||
      shippingAddress.zipCode === "" ||
      paymentType === ""
    ) {
      swal("Warning", "Please fill all the fields");
      return;
    }

    try {
      if (user) {
        setIsLoading(true);
        console.log("Try Block Executed");
        const firestore = getFirestore();
        const orderCollectionRef = collection(firestore, "orderDetails");
        const orderDocumentRef = doc(orderCollectionRef, user.email);
        console.log(user.email)
        const orderDocumentSnapshot = await getDoc(orderDocumentRef);

        let existingOrderItems = [];
        if (orderDocumentSnapshot.exists()) {
          const existingOrderData = orderDocumentSnapshot.data();
          existingOrderItems = existingOrderData.orders || [];
        }
        // Update the stock quantity of each product

        for (let i = 0; i < orderData.length; i++) {
          const product = orderData[i];
          const productRefs = getDocs(collection(firestore, "products"));
          (await productRefs).forEach(async (doc) => {
            if(doc.data().id === product.id){
              const productData = doc.data();
              const newQuantity = productData.stock - product.quantity;
              await updateDoc(doc.ref, {
                stock: newQuantity,
              });
            }
          })
        }
        
        const newOrder = {
          id: new Date().getTime(),
          timestamp: new Date(),
          orderItems: orderData,
          totalPrice: total,
          itemsOrdered: items,
          shippingAddress: { ...shippingAddress },
          status: "Order Placed",
          paymentType: paymentType,
          transactionId: transaction_id,
        };

        await generatePDF(newOrder);

        const updatedOrderItems = [newOrder, ...existingOrderItems];

        await setDoc(orderDocumentRef, {
          orders: updatedOrderItems,
        });
        console.log("Order placed successfully");
      }

      setIsOrderPlaced(true);
      localStorage.removeItem("cartItems");
      navigate("/myorders");
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setShippingAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePaymentOptionChange = (event) => {
    setPaymentType(event.target.value);
  };

  const renderLoadingView = () => (
    <div className="products-details-loader-container">
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
  );

  return (
    <div className="summary-page">
      <h1>Shopping Cart</h1>
      <div className="container">
        <div className="shipping-details">
          <details open>
            <summary className="payment-heading">Shipping Address</summary>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={shippingAddress.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={shippingAddress.address}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={shippingAddress.city}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={shippingAddress.state}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              value={shippingAddress.zipCode}
              onChange={handleInputChange}
            />
          </details>
        </div>
        <div className="payment-container">
          <details open>
            <summary className="payment-heading">Payment Methods</summary>
            <label className="payment-option">
              <input
                type="radio"
                name="payment-option"
                value="online"
                checked={paymentType === "online"}
                onChange={handlePaymentOptionChange}
              />
              <span className="text available">Online Payment</span>
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="payment-option"
                value="cash"
                checked={paymentType === "cash"}
                onChange={handlePaymentOptionChange}
              />
              <span className="text available">Cash on Delivery</span>
            </label>
          </details>
        </div>
        <div className="summary-container">
          <p>Summary</p>
          <hr />
          <div className="details">
            <p>Number of Items:</p>
            <p>{items}</p>
          </div>
          <div className="details">
            <p>Price:</p>
            <p>{total}/-</p>
          </div>
          <div className="details">
            <p>Delivery Charges:</p>
            <span className="green">Free</span>
          </div>
          <hr />
          <div className="details total">
            <p>Total Amount:</p>
            <p>{total}/-</p>
          </div>
        </div>
      </div>
      <div className="submit-container">
        <button
          type="submit"
          className="submit-button"
          onClick={
            paymentType === "online"
              ? () => displayRazorpay(total)
              : () => orderPlaced("nill")
          }
          disabled={isLoading}
        >
          {isLoading ? "Placing Order..." : "Confirm Order"}
        </button>
        {/* <button
          type="submit"
          className="submit-button"
          onClick={() => displayRazorpay(total)}
          disabled={isLoading}
        >
          {isLoading ? "Placing Order..." : "Razor Pay"}
        </button> */}
      </div>
      {isOrderPlaced && (
        <p className="green italic">Your order has been placed successfully</p>
      )}
      <hr />
    </div>
  );
};

export default SummaryPage;
