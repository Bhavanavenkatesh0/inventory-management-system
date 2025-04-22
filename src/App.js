import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SplashScreen from "./Components/SplashScreen/SplashScreen";
import SignIn from "./Components/SignIn/SignIn";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Dashboard from "./Components/Admin/Dashboard/Dashboard";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<SplashScreen />} exact />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<PrivateRoute> <Dashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
