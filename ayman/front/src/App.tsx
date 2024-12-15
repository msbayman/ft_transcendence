import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, Fragment } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Landing_Page from "./pages/Landing_Page/Landing_page_com/Landing_Page";
import Login_Page from "./pages/Login_Page/Login_Page";
import Signup_Page from "./pages/Signup_Page/Signup_Page";
import Valid_otp from "./pages/Valid_otp/Valid_otp";
import Overview from "./pages/My_Profile/Overview";
import ValidOtp from "./pages/Valid_otp/Valid_otp";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accessToken = Cookies.get("access_token");

    const validateAccessToken = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/check_csrf_tok/validate_token",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        return response.status === 200;
      } catch (error) {
        return false;
      }
    };

    const checkToken = async () => {
      if (
        location.pathname !== "/" &&
        location.pathname !== "/signup" &&
        location.pathname !== "/Valid_otp" &&
        location.pathname !== "/login"
      ) {
        const isValidToken = await validateAccessToken();
        if (!isValidToken) {
          navigate("/login");
        }
      }
    };

    if (
      !accessToken &&
      location.pathname !== "/" &&
      location.pathname !== "/signup" &&
      location.pathname !== "/Valid_otp"
    ) {
      navigate("/login");
    } else {
      checkToken();
    }
  }, [location.pathname, navigate]);

  return (
    <Fragment>
      <main>
        <Routes>
          <Route path="/" element={<Landing_Page />} />
          <Route path="login" element={<Login_Page />} />
          <Route path="signup" element={<Signup_Page />} />
          <Route path="/*" element={<Overview />} />
          <Route path="Valid_otp" element={<Valid_otp />} />
        </Routes>
      </main>
    </Fragment>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
