import {useState, useEffect} from 'react'
import swal from 'sweetalert'
import {collection, doc, getDoc, setDoc} from 'firebase/firestore'
import {db, auth} from '../../firebase'
import Header from '../Header'
import './index.css'

const MyDetails = () => {
  const [userDetails, setUserDetails] = useState({
    name: 'Not Available',
    phone: '',
    email: '',
  })
  const [isName, setIsName] = useState(false)
  const [isPhone, setIsPhone] = useState(false)
  const authinfo = JSON.parse(localStorage.getItem('authInfo'))
  const getDetails = () => {
    const users = collection(db, 'users')
    const docRef = doc(users, authinfo.email)
    console.log(userDetails)
    getDoc(docRef)
      .then(response => {
        if (response.data()) {
          setUserDetails(response.data())
          if (response.data().name !== 'Not Available') {
            setIsName(true)
          }
          if (response.data().phone !== 'Not Available') {
            setIsPhone(true)
          }
        }
        // window.location.reload()
      })
      .catch(error => {
        console.log(error)
      })
  }
  useEffect(() => {
    getDetails()
  }, [isName, isPhone])
  const editDetails = value => {
    console.log('editing name')
    if (value === 'name') {
      swal('Enter Your Name', {
        content: 'input',
      }).then(name => {
        if (!name) return
        const user = auth.currentUser
        setDoc(doc(db, 'users', user.email), {name}, {merge: true})
        console.log('Profile Updated')
      }).finally(() => {
        getDetails()
      })
    } else {
      swal('Enter Your 10 digit Phone Number', {
        content: 'input',
      }).then(phone => {
        if (!phone) return
        const user = auth.currentUser
        setDoc(doc(db, 'users', user.email), {phone}, {merge: true})
        console.log('Profile Updated')
      }).finally(() => {
        getDetails()
      })
    }
    // window.location.reload()
    
  }
  return (
    <>
      <Header />
      <div className="main-container">
        <div className="my-details-container">
          <h1 className="my-details-heading">My Details</h1>
          <p className="my-details-description">*Can edit only once</p>
          <p>
            Name: <span>{userDetails.name || 'Not Available'}</span>{' '}
            {!isName && (
              <button
                className="edit-btn"
                type="button"
                onClick={() => {
                  editDetails('name')
                }}
              >
                Add
              </button>
            )}
          </p>
          <p>
            Email: <span>{userDetails.email}</span>
          </p>
          <p>
            Phone: <span>{userDetails.phone || 'Not Available'}</span>
            {!isPhone && (
              <button
                className="edit-btn"
                type="button"
                onClick={() => {
                  editDetails('phone')
                }}
              >
                Add
              </button>
            )}
          </p>
        </div>
      </div>
    </>
  )
}
export default MyDetails
