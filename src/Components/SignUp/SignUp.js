import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-center align-items-center bg-primary" style={{ height: "100vh" }}>
            <form className="form-control w-50 h-75 d-flex flex-column p-5 justify-content-center">
                <span className="h1 text-center">Sign Up</span>

                <label className="h6 pt-3">Username</label>
                <input type="text" className="form-control" placeholder="Enter username" />

                <label className="h6 pt-3">Email</label>
                <input type="email" className="form-control" placeholder="Enter email address" />

                <label className="h6 pt-3">Phone</label>
                <input type="phone" className="form-control" placeholder="Enter phone number" />

                <label className="h6 pt-3">Password</label>
                <input type="password" className="form-control" placeholder="Enter your password" />

                <input type="submit" value="Sign Up" className="btn btn-dark p-2 mt-3 fs-5" />

                <span className="h6 text-center forgotPassword pt-4">Already have an account? <span onClick={() => navigate('/signin')} className='fw-bolder' style={{ color: "#2d79f3", cursor: "pointer" }}>Sign In</span></span>

            </form>
        </div>
    );
}

export default SignUp;
