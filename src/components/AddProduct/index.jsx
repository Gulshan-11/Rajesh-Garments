import AdminHeader from "../AdminHeader";
import CSVReader from 'react-csv-reader';
import {
  getFirestore,
  collection,
  addDoc,
} from 'firebase/firestore';
import swal from "sweetalert";

const AddProduct = () => {
  const handleCsvData = async (data) => {
    try {
      const [headers, ...rows] = data;
      const firestore = getFirestore();
      const productsCollectionRef = collection(firestore, 'products');

      // Loop through each row and add it to Firestore
      rows.forEach(async (row) => {
        const dataObject = {};
        headers.forEach((header, index) => {
          if(header === 'category' || header === 'rating') {
            dataObject[header] = Number(row[index]);
          }
          else if(header==='prices'){
            dataObject[header]=row[index].split(', ').map(Number)

          }
          else if(header==='size'){
            dataObject[header]=row[index].split(', ')
          }
          else{
            dataObject[header] = row[index];
          }
          console.log(header, dataObject[header]);
        });

        // Use addDoc to add a document to the 'products' collection
        await addDoc(productsCollectionRef, dataObject);
        console.log('Data added to Firestore');
        setTimeout(() => {
          swal({
            title: "Success!",
            text: "Data added to Firestore",
          })
        }, 1000)
      });
    } catch (error) {
      console.error('Error adding data to Firestore:', error);
    }
  };

  return (
    <>
      <AdminHeader />
      <div>
        Add Product
        <div>
          <h2>CSV Uploader</h2>
          <CSVReader onFileLoaded={handleCsvData} />
          {/* <button onClick={handleCsvData}>Upload</button> */}
        </div>
      </div>
    </>
  );
};

export default AddProduct;
