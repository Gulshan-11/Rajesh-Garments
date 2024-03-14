// import {v4 as uuidv4} from 'uuid'
import { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import FiltersGroup from "../FiltersGroup";
import ProductCard from "../ProductCard";
import ProductsHeader from "../ProductsHeader";

import "./index.css";

const categoryOptions = [
  {
    name: "All Products",
    categoryId: 0,
  },
  {
    name: "Pants",
    categoryId: 1,
  },
  {
    name: "Watches",
    categoryId: 2,
  },
  {
    name: "Socks",
    categoryId: 3,
  },
  {
    name: "Shoes",
    categoryId: 4,
  },
  {
    name: "T-Shirts",
    categoryId: 5,
  },
];

const sortbyOptions = [
  {
    optionId: "PRICE_HIGH",
    displayText: "Price (High-Low)",
  },
  {
    optionId: "PRICE_LOW",
    displayText: "Price (Low-High)",
  },
];

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const AllProducts = () => {
  const [productsList, setProductsList] = useState([]);
  const [filteredProductsList, setfilteredProductsList] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [activeOptionId, setActiveOptionId] = useState(
    sortbyOptions[0].optionId
  );
  const [activeCategoryId, setActiveCategoryId] = useState(0);
  const [activeCategory, setActiveCategory] = useState(categoryOptions[0].name);
  const [searchInput, setSearchInput] = useState("");
  const [activeRatingId, setActiveRatingId] = useState("");

  const getProductsByCategory = async () => {
    try {
      setApiStatus(apiStatusConstants.inProgress);

      const firestore = getFirestore();
      const colRef = collection(firestore, "products");
      const snapshot = await getDocs(colRef);
      const productsListData = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      console.log(productsListData);
      setProductsList(productsListData);
      setApiStatus(apiStatusConstants.success);
    } catch (error) {
      console.error("Error fetching products from Firestore:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    getProductsByCategory();
  }, []);

  const renderLoadingView = () => (
    <div className="products-loader-container">
      {/* <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" /> */}
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
      {/* <p>Loading....</p> */}
    </div>
  );

  const renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="all-products-error"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  );

  const changeSortby = (newActiveOptionId) => {
    setActiveOptionId(newActiveOptionId);
    getProductsByCategory(activeCategoryId);
  };

  const changeCategory = async (newActiveCategoryId) => {
    setActiveCategoryId(newActiveCategoryId);
    console.log(productsList);
    const filteredProducts = productsList.filter(
      (product) => product.category === newActiveCategoryId
    );
    console.log(filteredProducts);
    setfilteredProductsList(filteredProducts);
    setActiveCategory(categoryOptions[newActiveCategoryId].name);
  };

  const renderProductsListView = () => {
    const shouldShowProductsList = productsList.length > 0;

    return shouldShowProductsList ? (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={changeSortby}
          categoryName={activeCategory}
        />
        <ul className="products-list">
          {activeCategoryId === 0 && searchInput === ""
            ? productsList.map((product) => (
                <ProductCard productData={product} key={product.id} />
              ))
            : filteredProductsList.map((product) => (
                <ProductCard productData={product} key={product.id} />
              ))}
        </ul>

        <p>
          {activeCategoryId === 0 && searchInput === ""
            ? productsList.length
            : filteredProductsList.length}{" "}
          Product(s) Found
        </p>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          className="no-products-img"
          alt="no products"
        />
        <h1 className="no-products-heading">No Products Found</h1>
        <p className="no-products-description">
          We could not find any products. Try other filters.
        </p>
      </div>
    );
  };

  const renderAllProducts = () => {
    console.log(apiStatus);
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderProductsListView();
      case apiStatusConstants.failure:
        return renderFailureView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    changeCategory(0);
    setActiveRatingId("");
    getProductsByCategory();
  };

  const enterSearchInput = () => {
    getProductsByCategory(activeCategoryId);
  };

  const changeSearchInput = (newSearchInput) => {
    setSearchInput(newSearchInput);
    const filteredProducts = productsList.filter((product) =>
      product.title.toLowerCase().includes(newSearchInput.toLowerCase())
    );
    setfilteredProductsList(filteredProducts);
  };

  return (
    <div className="all-products-section">
      <FiltersGroup
        searchInput={searchInput}
        categoryOptions={categoryOptions}
        changeSearchInput={changeSearchInput}
        enterSearchInput={enterSearchInput}
        activeCategoryId={activeCategoryId}
        activeRatingId={activeRatingId}
        changeCategory={changeCategory}
        clearFilters={clearFilters}
      />
      {renderAllProducts()}
    </div>
  );
};

export default AllProducts;
