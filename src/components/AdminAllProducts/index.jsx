import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
} from 'firebase/firestore';
import { auth } from '../../firebase';
import AdminHeader from "../AdminHeader";

const AdminAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [initialDataFetched, setInitialDataFetched] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        const firestore = getFirestore();
        const productsCollectionRef = collection(firestore, 'products');
        const productsQuery = query(productsCollectionRef);

        try {
          const productsSnapshot = await getDocs(productsQuery);

          const allProducts = [];

          productsSnapshot.forEach(productDocument => {
            const productData = productDocument.data();
            allProducts.push(productData);
          });

          setProducts(allProducts);
          setInitialDataFetched(true);
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      } else {
        setProducts([]);
        setInitialDataFetched(true);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <>
      <AdminHeader />
      <div>
        <h2>Admin All Products</h2>
        {initialDataFetched ? (
          <table border={1}>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Category</th>
                <th>ID</th>
                <th>Image URL</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>
                  <td>{product.id}</td>
                  <td><a href={product.imageUrl} target="_blank">{product.imageUrl}</a></td>
                  <td>{product.price}</td>
                  <td>{product.rating}</td>
                  <td>{product.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </>
  );
};

export default AdminAllProducts;
