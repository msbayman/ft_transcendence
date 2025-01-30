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
import { PlayerProvider, usePlayer } from "./pages/My_Profile/PlayerContext";
import Game_Local from "./pages/Game_Page/Game_Local";
import Game_Tourn from "./pages/Game_Page/Game_Fortourn";
import Game_Loby from "./pages/Game_Page/Game_loby";
import Tournaments from "./pages/Game_Page/Tournaments";
import { TournProvider } from "./pages/Game_Page/TournContext";
import { Toaster } from 'react-hot-toast';
import End_of_Game from './pages/Game_Page/End_of_Game';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchPlayerData, clearPlayerData, wsConnection } = usePlayer();

  useEffect(() => {
    const accessToken = Cookies.get("access_token");

    const validateAccessToken = async () => {
      try {

        const response = await axios.get(
          "https://localhost/api/check_csrf_tok/validate_token",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        wsConnection()
        return response.status === 200;
      } catch (error) {
        return false;
      }
    };

      const checkToken = async () => {
      const publicPaths = ["/", "/signup", "/Valid_otp", "/login"];
      const isPublicPath = publicPaths.includes(location.pathname);

      if (!accessToken) {
        if (!isPublicPath) {
          clearPlayerData();
          navigate("/login");
        }
        return;
      }

      const isValidToken = await validateAccessToken();

      if (isPublicPath) {
        if (isValidToken) {
          navigate("/Overview");
        }
      } else {
        if (!isValidToken) {
          clearPlayerData();
          navigate("/login");
        } else {
          fetchPlayerData();
        }
      }
    };

    if (
      !accessToken &&
      location.pathname !== "/" &&
      location.pathname !== "/signup" &&
      location.pathname !== "/Valid_otp"
    ) {
      clearPlayerData();
      navigate("/login");
    } else {
      checkToken();
    }
  }, [location.pathname, navigate, fetchPlayerData, clearPlayerData, wsConnection]);

  return (
    <Fragment>
      <main>
        <Routes>
          <Route path="/" element={<Landing_Page />} />
          <Route path="login" element={<Login_Page />} />
          <Route path="signup" element={<Signup_Page />} />
          <Route path="/*" element={<Overview />} />
          <Route path="Valid_otp" element={<Valid_otp />} />
          <Route path="/local_game" element={<Game_Local />} />
          <Route path="/remote_game" element={<Game_Loby />} />
          <Route path="/tourn_game" element={<Game_Tourn />} />
          <Route path="/tourn" element={<Tournaments />} />
          <Route path="/Game_Result" element={<End_of_Game />} />

        </Routes>
        <Toaster />
      </main>
    </Fragment>
  );
}

function App() {
  return (
    <PlayerProvider>
      <TournProvider>
        <AppContent />
      </TournProvider>
    </PlayerProvider>
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
