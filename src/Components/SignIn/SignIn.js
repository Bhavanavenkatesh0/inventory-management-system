import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get, child } from 'firebase/database';
import { Button, IconButton, InputAdornment, Snackbar, TextField } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import logo from '../../assets/images/logo.svg'
import marbleBG from '../../assets/images/marbleBg.jpg';
import MuiAlert from '@mui/material/Alert';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';


const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // error or success
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  });


  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setToast({
        open: true,
        message: "Please enter valid credentials.!",
        severity: "error"
      });
      return;
    }

    try {

      const db = getDatabase();
      const dbRef = ref(db);

      const snapshot = await get(child(dbRef, 'users'));


      if (snapshot.exists()) {
        const users = snapshot.val();
        const userEntry = Object.values(users).find(user => user.email === email && user.password === password);

        if (userEntry) {
          const sessionId = crypto.randomUUID();

          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("sessionId", sessionId);
          localStorage.setItem("userRole", userEntry.role);
          localStorage.setItem("userEmail", userEntry.email);
          localStorage.setItem("userName", userEntry.username);
          localStorage.setItem("userID", userEntry.id);

          setToast({
            open: true,
            message: "Sign in Successful.!",
            severity: "success"
          });
          setTimeout(() => navigate("/dashboard"), 1000);
        } else {
          setToast({
            open: true,
            message: "Invalid email and password.!",
            severity: "error"
          });
        }
      } else {
        setToast({
          open: true,
          message: "No users found in database.",
          severity: "error"
        });
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setToast({
        open: true,
        message: "Something went wrong. Try again!",
        severity: 'error'
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center w-100" style={{ height: "100vh" }}>
      <div className='companyInfo w-50 d-flex flex-column justify-content-center align-items-center'>
        <img src={logo} alt="appLogo" width="70%" height="auto" />
        <span className='lh-base' style={{ fontSize: "4.4rem", color: "#031A6B", fontFamily: 'Roboto', fontWeight: 300 }}>Marble <span style={{ color: "#004385" }}>&</span> Might</span>
      </div>
      <div className='formDiv w-50 d-flex justify-content-center align-items-center'>
        <form
          onSubmit={handleSignIn}
          className="signInForm w-75 h-75 d-flex flex-column p-5 justify-content-center"
          style={{
            backgroundImage: `url(${marbleBG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: '5px 5px 50px 0 rgba(192, 192, 192, 0.59)',
            border: "2px outset white",
            WebkitBackdropFilter: 'blur(10px)',
            color: '#000',
            fontFamily: "Roboto",
          }}>

          <div style={{ width: "100%" }}>
            <Snackbar
              open={toast.open}
              autoHideDuration={2000}
              onClose={() => setToast({ ...toast, open: false })}
              anchorOrigin={{ vertical: "top", horizontal: "center" }} style={{ width: "100%", padding: "0 2.5rem" }}>
              <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} style={{ width: "100%", margin: 0 }}>
                {toast.message}
              </Alert>
            </Snackbar>
          </div>

          <span className="h1 text-start" style={{ fontSize: "3.5rem", fontFamily: "Roboto", fontWeight: "700", color: "#262728" }}>Sign in</span>

          <label className="h6 pt-3">Email</label>
          <TextField id="outlined-basic"
            variant="outlined"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <EmailIcon />
                </InputAdornment>
              )
            }} />

          <label className="h6 pt-3">Password</label>
          <TextField id="outlined-basic"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton aria-label={showPassword ? "hide the password" : "display the password"}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }} />

          <span className="h6 text-end forgotPassword pt-2" style={{ color: "#2d79f3", cursor: "pointer", fontWeight: "600" }}>Forgot Password?</span>
          <Button variant="contained" style={{ background: "#004385", fontWeight: "400", fontFamily: "Roboto" }} type="submit" className="mt-3 fs-5" >SIgn In</Button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
