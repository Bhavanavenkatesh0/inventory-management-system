import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../firebase';

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    try {
      const usersRef = collection(firestore, "users");
      const emailQuery = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(emailQuery);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
  
        console.log("Stored Password:", userData.password); // Debugging
        console.log("Entered Password:", password); // Debugging
  
        const trimmedPassword = password.trim(); // Trim spaces
        if (userData.password === trimmedPassword) {
          alert("Sign in successful!");
          navigate("/dashboard");
        } else {
          alert("Invalid password");
        }
      } else {
        alert("Email not found.");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Something went wrong. Try again!");
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary" style={{ height: "100vh" }}>
      <form onSubmit={handleSignIn} className="form-control w-50 h-75 d-flex flex-column p-5 justify-content-center">
        <span className="h1 text-center">Sign In</span>

        <label className="h6 pt-3">Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="h6 pt-3">Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <span className="h6 text-end forgotPassword pt-2 fw-bolder" style={{ color: "#2d79f3" }}>Forgot Password?</span>
        <input type="submit" value="Sign In" className="btn btn-dark p-2 mt-3 fs-5" />
      </form>
    </div>
  );
};

export default SignIn;
