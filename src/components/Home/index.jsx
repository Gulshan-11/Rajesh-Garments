import {Link} from 'react-router-dom'
import {useState} from 'react'
import {collection, doc, getDoc} from 'firebase/firestore'
import Header from '../Header'
import './index.css'
import {db} from '../../firebase'
import Footer from '../Footer'

const Home = () => {
  const authinfo = JSON.parse(localStorage.getItem('authInfo'))
  const users = collection(db, 'users')
  const docRef = doc(users, authinfo.email)
  const [name, setName] = useState('')
  getDoc(docRef)
    .then(response => {
      setName(response.data().name)
    })
    .catch(error => {
      console.log(error)
    })
  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-heading">Clothes That Get You Noticed</h1>
          <h1>
            Welcome {name === 'Not Available' ? authinfo.email : name}
            {''}
          </h1>
          <img
            src="https://res.cloudinary.com/dhsesp3bq/image/upload/v1690105700/images/image1_jkq6ss.png"
            alt="clothes that get you noticed"
            className="home-mobile-img"
          />
          <p className="home-description">
            Fashion is part of the daily air and it does not quite help that it
            changes all the time. Clothes have always been a marker of the era
            and we are in a revolution. Your fashion makes you been seen and
            heard that way you are. So, celebrate the seasons new and exciting
            fashion in your own way.
          </p>
          <Link to="/products">
            <button type="button" className="shop-now-button">
              Shop Now
            </button>
          </Link>
        </div>
        <img
          src="https://res.cloudinary.com/dhsesp3bq/image/upload/v1690105700/images/image1_jkq6ss.png"
          alt="clothes that get you noticed"
          className="home-desktop-img"
        />
      </div>
      <Footer />
    </>
  )
}
export default Home
