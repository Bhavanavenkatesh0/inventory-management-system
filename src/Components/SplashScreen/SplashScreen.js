import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../res/images/logo.svg'
import heroImage from '../../res/images/HeroImage.svg'

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/signin");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container d-flex flex-column py-5" style={{ height: "100vh" }}>
      <header>
        <img src={logo} alt="appLogo" width="8%" height="auto" />
      </header>
      <div className="d-flex justify-content-between align-items-center h-100">
        <div className="d-flex flex-column" style={{ width: "70%" }}>
          <span className="fw-bold lh-sm" style={{ fontSize: "3rem", color: "#1E1E1E" }}>
            Welcome to <span className="fw-bolder" style={{ fontSize: "3.5rem", color: "#031A6B" }}>Marble <span style={{ color: "#004385" }}>&</span> Might</span>
          </span>
          <span className="fw-bold lh-sm" style={{ fontSize: "4.5rem", color: "#033860" }}>Built to Last.</span>
          <span className="fw-bold lh-sm" style={{ fontSize: "4.5rem", color: "#033860" }}>Styled to Impress.</span>
        </div>
        <div className="w-50 h-100 d-flex justify-content-end align-items-end">
          <img src={heroImage} alt="heroImage" width="90%" height="auto" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
