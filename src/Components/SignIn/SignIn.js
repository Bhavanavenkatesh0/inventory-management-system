import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { TextField } from '@mui/material';

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("email", "==", email), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Credentials matched
        alert("Sign in successful!");
        navigate("/dashboard");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <div className="container d-flex justify-content-center w-100" style={{ height: "100vh" }}>
      <div className='companyInfo w-50 d-flex align-items-center'>
        <h1 className='text-white'>Welcome Thej,</h1>
      </div>
      <div className='formDiv w-50 d-flex justify-content-center align-items-center'>
        <form onSubmit={handleSignIn} className="signInForm bg-transparent w-75 h-75 d-flex flex-column p-5 justify-content-center">
          <span className="h1 text-start text-white">Sign In</span>

          <label className="pt-3 text-white fw-regular">Email</label>
          <TextField id="outlined-basic"
            variant="outlined"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />

          <label className="h6 pt-3">Password</label>
          <TextField id="outlined-basic"
            variant="outlined"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />

          <span className="h6 text-end forgotPassword pt-2 fw-bolder" style={{ color: "#2d79f3" }}>Forgot Password?</span>
          <input type="submit" value="Sign In" className="btn btn-dark p-2 mt-3 fs-5" />
        </form>
      </div>
    </div>
  );
};

export default SignIn;
