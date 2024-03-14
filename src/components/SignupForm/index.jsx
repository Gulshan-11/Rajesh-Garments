import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";

import "./index.css";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const navigate = useNavigate();

  const onChangeUsername = (event) => {
    setEmail(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const onChangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };

  const onSubmitSuccess = (jwtToken) => {
    setRedirectToLogin(true);
    const name = "Not Available";
    const phone = "Not Available";
    const role = "customer"
    const authInfo = auth.currentUser;
    localStorage.setItem("authInfo", JSON.stringify(authInfo));

    // Store the JWT token in cookies
    Cookies.set("jwt_token", jwtToken, {
      expires: 30,
    });
    const users = collection(db, "users");
    const docRef = doc(users, email);
    setDoc(docRef, { name, phone, email, role }, { merge: true });
    localStorage.setItem("userInfo", JSON.stringify({ name, phone, email, role }));
    navigate("/");
  };

  const onSubmitFailure = (errorMsg) => {
    setShowSubmitError(true);
    setErrorMsg(errorMsg);
  };

  const submitForm = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      onSubmitFailure("Passwords don't match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      onSubmitSuccess(userCredential.user.uid);
    } catch (error) {
      // You can handle the error here, set an appropriate error message
      onSubmitFailure(error.message);
    }
  };

  if (redirectToLogin) {
    navigate('/login')
    return null
  }

  return (
    <div className="signup-page">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
        className="login-img"
        alt="website login"
      />
      <div className="signup-form-container">
        <form className="form-container" onSubmit={submitForm}>
          <img
            src="https://res.cloudinary.com/dhsesp3bq/image/upload/v1690130873/images/Shop-logo_juxcnv.png"
            className="login-img-logo"
            alt="website logo"
          />
          <div className="input-container">
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
          </div>
          <div className="input-container">
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
          </div>
          <div className="input-container">
            <label className="input-label" htmlFor="confirmPassword">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="confirm-password-input-field password-input-field"
              value={confirmPassword}
              onChange={onChangeConfirmPassword}
              placeholder="Confirm Password"
            />
          </div>
          <button type="submit" className="login-button">
            Sign Up
          </button>
          {showSubmitError && <p className="error-message">{errorMsg}</p>}
        <Link to="/login">Login</Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;
