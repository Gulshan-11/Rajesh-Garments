import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {collection, doc, getDoc} from 'firebase/firestore';
import { auth, db } from "../../firebase";
import Cookies from "js-cookie";

import "./index.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const jwtToken = Cookies.get("jwt_token");
  const navigate = useNavigate();

  const onChangeUsername = (event) => {
    setEmail(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitSuccess = async (jwtToken) => {
    const authInfo = auth.currentUser;
    localStorage.setItem("authInfo", JSON.stringify(authInfo));
    const users = collection(db, 'users')
    const docRef = doc(users, authInfo.email)
    // console.log(docRef)
    await getDoc(docRef)
      .then(response => {
        console.log(response.data())
        localStorage.setItem('userInfo', JSON.stringify(response.data()))
        Cookies.set("jwt_token", jwtToken, {
          expires: 30,
        });
        if (response.data().role === "admin") {
          console.log("if condition");
          navigate("/orders");
        } else {
          navigate("/");
        }
        console.log("onSubmitSuccess function");
      })
      .catch(error => {
        console.log(error)
      })
    // console.log(role)
  };

  const onSubmitFailure = (errorMsg) => {
    setShowSubmitError(true);
    setErrorMsg(errorMsg);
  };

  const submitForm = async (event) => {
    event.preventDefault();

    if (email === "" || password === "") {
      onSubmitFailure("Please enter all the fields");
      return;
    }

    try {
      // Sign in the user using Firebase Authentication
      signInWithEmailAndPassword(auth, email, password)
        .then((res) => {
          onSubmitSuccess(res.user.uid);
        })
        .catch((error) => {
          onSubmitFailure(error.message);
        });
    } catch (error) {
      onSubmitFailure(error.message);
    }
  };

  const renderPasswordField = () => {
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={onChangePassword}
          placeholder="Password"
        />
      </>
    );
  };

  const renderUsernameField = () => {
    return (
      <>
        <label className="input-label" htmlFor="username">
          EMAIL
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={email}
          onChange={onChangeUsername}
          placeholder="Email"
        />
      </>
    );
  };

  if (jwtToken !== undefined) {
    navigate("/");
    return null;
  }

  return (
    <div className="login-form-container">
      <img
        src="https://res.cloudinary.com/dhsesp3bq/image/upload/v1690130873/images/Shop-logo_juxcnv.png"
        className="login-website-logo-mobile-img"
        alt="website logo"
      />
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
        className="login-img"
        alt="website login"
      />
      <form className="form-container" onSubmit={submitForm}>
        <img
          src="https://res.cloudinary.com/dhsesp3bq/image/upload/v1690130873/images/Shop-logo_juxcnv.png"
          className="login-website-logo-desktop-img"
          alt="website logo"
        />
        <div className="input-container">{renderUsernameField()}</div>
        <div className="input-container">{renderPasswordField()}</div>
        <button type="submit" className="login-button">
          Login
        </button>
        <Link to="/signup">Sign Up</Link>
        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
