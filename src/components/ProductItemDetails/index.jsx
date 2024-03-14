import { Link } from "react-router-dom";
import { BsPlusSquare, BsDashSquare } from "react-icons/bs";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import Header from "../Header";

import "./index.css";
import swal from "sweetalert";

const ProductItemDetails = () => {
  const productData = JSON.parse(localStorage.getItem("productData"));
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(false);
  const [selectedSize, setSelectedSize] = useState(productData.size[0]);
  const [selectedPrice, setSelectedPrice] = useState(productData.prices[0]);
  if (productData === null) {
    setError(true);
  }
  console.log(selectedPrice,selectedSize)

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

  const renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  );

  const renderProductDetailsView = (productData) => {
    const { brand, imageUrl, rating, title, stock, category } = productData;

    const onClickAddToCart = () => {
      const existingCartData =
        JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingProductIndex = existingCartData.findIndex(
        (item) => item.id === productData.id && item.selectedSize === selectedSize
      );

      if (existingProductIndex !== -1) {
        existingCartData[existingProductIndex].quantity += quantity;
      } else {
        existingCartData.push({
          brand,
          category,
          rating,
          imageUrl,
          title,
          quantity,
          selectedPrice,
          selectedSize,
        });
      }
      localStorage.setItem("cartItems", JSON.stringify(existingCartData));
      swal({
        title: "Success",
        text: "Item added to cart",
        icon: "success",
        button: "Ok",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };

    return (
      <>
        <div className="product-details-success-view">
          <div className="product-details-container">
            <img src={imageUrl} alt="product" className="product-image" />
            <div className="product">
              <h1 className="product-name">{title}</h1>
              <p className="price-details">
                Rs {selectedPrice}/-
              </p>
              <p className="">Available Quantity: {stock} </p>
              <div className="rating-and-reviews-count">
                <div className="rating-container">
                  <p className="rating">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star"
                  />
                </div>
              </div>
              <div className="label-value-container">
                <p className="label">Brand:</p>
                <p className="value">{brand}</p>
              </div>
              <div className="size-controller">
                <select
                  name="size"
                  id="size"
                  className="select-size"
                  onChange={(e) => {
                    setSelectedPrice(productData.prices[e.target.value]);
                    setSelectedSize(productData.size[e.target.value]);
                  }}
                >
                  {productData.size.map((eachSize, index) => (
                    <option value={index} key={index}>
                      {eachSize}
                    </option>
                  ))}
                </select>
              </div>

              <hr className="horizontal-line" />
              <div className="quantity-container">
                <input
                  type="number"
                  className="quantity-controller-value"
                  value={quantity}
                  onChange={(e) => {const newValue = parseInt(e.target.value);
                    setQuantity(newValue >= 1 ? newValue : 1);}}
                />
              </div>
              <button
                type="button"
                className="button add-to-cart-button"
                onClick={onClickAddToCart}
                disabled={stock - quantity <= 0}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Header />
      <br />
      <div className="container">
        {!error && renderProductDetailsView(productData)}
      </div>
      {error && renderFailureView()}
    </>
  );
};

export default ProductItemDetails;
