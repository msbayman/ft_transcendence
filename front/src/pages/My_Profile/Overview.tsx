import { useState, useEffect } from "react";
import over from "./Overview.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import { NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import Overview_Page from "./Overview_Page/Overview_Page";
import Profile_Page from "./Profile_Page/Profile_Page";
import Other_Profile_Page from "./Profile_Page/Other_Profile/Other_Profile_Page";
import Play_Page from "./Play_Page/Play_Page";
import Friends_Page from "./Friends_Page/Friends_Page";
import Settings_Page from "./Settings_Page/Settings_Page";
import The_Leaderboard from "./Leaderboard_Page/The_Leaderboard";
import Notifications_p from "./Notifications/Notifications";
import { usePlayer } from "./PlayerContext";
import Search from "./Search_Content/Search";
import NotFound from "../../NotFound";
import { useNavigate } from 'react-router-dom';
import { config } from "../../config";
import { toast } from "react-hot-toast";


interface Notification {
  sender: string;
  profile_image: string;
  content: string;
  type: string;
  id?: string;
}

function Overview() {
  const { HOST_URL } = config;
  const location = useLocation();
  const dataPlayer = usePlayer();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const state = location.state as { fromOAuth?: boolean };
    const searchParams = new URLSearchParams(location.search);

    if (!state?.fromOAuth) {
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");

      if (accessToken && refreshToken) {
        Cookies.set("access_token", accessToken, { path: "/" });
        Cookies.set("refresh_token", refreshToken, { path: "/" });
      }
    }
  }, [location]);

  useEffect(() => {
    if (dataPlayer?.ws) {
      const handleWebSocketMessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "challenge_accepted") {
            navigate('/Game_challeng', { state: { challenged: data.receiver, challenger:data.sender} });
          }
          if (data.type === "challenge_notification") {
            toast.success(`you have been challenged by: ${data.sender}`)
            const notificationWithId = { 
              ...data, 
              id: Date.now().toString()
            };
            setNotifications((prev) => [...prev, notificationWithId]);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
  
      dataPlayer.ws.addEventListener('message', handleWebSocketMessage);
      return () => {
        dataPlayer.ws?.removeEventListener('message', handleWebSocketMessage);
      };
    }
  }, [dataPlayer?.ws, navigate]);
  
  // Clear notification handler
  const clearNotification = (id?: string) => {
    if (id) {
      setNotifications((prev) => prev.filter(notif => notif.id !== id));
    } else {
      setNotifications([]);
    }
  };
  const Notifications_f = () => setShowNotifications((prev) => !prev);

  const check_logout = async () => {
    if (dataPlayer?.ws)
      {
        dataPlayer?.ws.send(JSON.stringify({type: "clear_list"}))
      }
    dataPlayer?.closeWsConnection()
    const refreshToken = Cookies.get("refresh_token");
    const accessToken = Cookies.get("access_token");

    try {
      await axios.post(
        `${HOST_URL}/api/user_auth/LogoutAPIView/`,
        { refresh_token: refreshToken },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } finally {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
    }
  };

  const Choose_Profile = () => {
    const { username } = useParams<{ username: string }>();
    return dataPlayer?.playerData?.username === username ? (
      <Profile_Page />
    ) : (
      <Other_Profile_Page username={username || ""} />
    );
  };

  const localistation = useLocation();


  const getNavLink = (path: string) => {
    if (path === "/Overview") {
      return "/" + localistation.pathname.split("/")[1] === path
        ? `${over.navbar_item1} ${over.nav_color1} ${over.Overview}`
        : over.navbar_item1;
    } else if (path === "/Profile") {
      return "/" + localistation.pathname.split("/")[1] === path
        ? `${over.navbar_item1} ${over.nav_color1} ${over.Profile}`
        : over.navbar_item1;
    } else if (path === "/Play") {
      return "/" + localistation.pathname.split("/")[1] === path
        ? `${over.navbar_item1} ${over.nav_color1} ${over.Play}`
        : over.navbar_item1;
    } else if (path === "/Friends") {
      return "/" + localistation.pathname.split("/")[1] === path
        ? `${over.navbar_item1} ${over.nav_color1} ${over.Friends}`
        : over.navbar_item1;
    } else if (path === "/Leaderboard") {
      return "/" + localistation.pathname.split("/")[1] === path
        ? `${over.navbar_item1} ${over.nav_color1} ${over.Shop}`
        : over.navbar_item1;
    }
  };

  const getNavLinkBar = (path: string) => {
    const currentPath = "/" + localistation.pathname.split("/")[1];
    return currentPath === path
      ? path === "/Settings"
        ? over.selected1
        : over.selected
      : over.selected_hide;
  };

  const [ActiveNavbar, setActiveNavbar] = useState(false);
  const ClickToActive = () => setActiveNavbar((prev) => !prev);

  useEffect(() => {
    const CheckWindow = () => setActiveNavbar(window.innerWidth > 1000);
    CheckWindow();
    window.addEventListener("resize", CheckWindow);
    return () => window.removeEventListener("resize", CheckWindow);
  }, []);

  // const clearNotification = (id?: string) => {
  //   if (id) {
  //     // Clear a specific notification by ID
  //     setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  //   } else {
  //     // Clear all notifications
  //     setNotifications([]);
  //   }
  // };

  return (
    <div className={over.all} style={{ backgroundImage: `url('/Navbar/Back_left_Side.png')` }}>
      {showNotifications && (
        <div className={over.notif}>
          <Notifications_p
            showNotifications={notifications.length > 0}
            notifications={notifications}
            onClose={() => setShowNotifications(false)}
            onClear={clearNotification}
          />
        </div>
      )}

      <div className={ActiveNavbar ? over.cercle : over.cercle_hide} onClick={ClickToActive}>
        <img
          src="/Navbar/Close_Navbar.svg"
          className={ActiveNavbar ? over.Open_Navbar : over.Open_Navbar_hide}
          alt="Close menu"
        />
        <img
          src="/Navbar/Open_Navbar.svg"
          className={ActiveNavbar ? over.Open_Navbar_hide : over.Open_Navbar}
          alt="Open menu"
        />
      </div>

      <div className={ActiveNavbar ? over.right_navbar : `${over.Hide} ${over.Nav_right_hide}`}>
        <div className={over.the_logo}>
          <img src="/Navbar/Logo_ping.svg" className={`${over.imgg1} ${over.imgg1_hide}`} alt="Logo" />
        </div>

        <div className={over.bar_search}>
          <Search />
        </div>

        <div className={over.content_navbar_item1}>
          <NavLink to="Overview" className={getNavLink("/Overview")}>
            <img src="/Navbar/Overiew.svg" className={over.imgg} alt="Overview" />
            <span className={over.hidden_name}>Overview</span>
            <div className={getNavLinkBar("/Overview")} />
          </NavLink>

          <NavLink
            to={`Profile/${dataPlayer?.playerData?.username || ""}`}
            className={getNavLink("/Profile")}
          >
            <img src="/Navbar/Profie.svg" className={over.imgg} alt="Profile" />
            <span className={over.hidden_name}>Profile</span>
            <div className={getNavLinkBar("/Profile")} />
          </NavLink>

          <NavLink to="Play" className={getNavLink("/Play")}>
            <img src="/Navbar/Play.svg" className={over.imgg} alt="Play" />
            <span className={over.hidden_name}>Play</span>
            <div className={getNavLinkBar("/Play")} />
          </NavLink>

          <NavLink to="Friends" className={getNavLink("/Friends")}>
            <img src="/Navbar/Friends.svg" className={over.imgg} alt="Friends" />
            <span className={over.hidden_name}>Friends</span>
            <div className={getNavLinkBar("/Friends")} />
          </NavLink>

          <NavLink to="Leaderboard" className={getNavLink("/Leaderboard")}>
            <img src="/Navbar/Leaderboard_icon.png" className={over.imgg} alt="Leaderboard" />
            <span className={over.hidden_name}>Leaderboard</span>
            <div className={getNavLinkBar("/Leaderboard")} />
          </NavLink>
        </div>

        <div className={`${over.content_navbar_item2} ${over.content_navbar_item2_hide}`}>
          <div className={over.hr_cont}>
            <hr className={over.brr} />
          </div>

          <button onClick={Notifications_f}>
            <span className={`${over.navbar_item2} ${over.Notifications}`}>
              <img src="/Navbar/Notifications.svg" className={over.imgg} alt="Notifications" />
              <span className={over.hidden_name}>Notifications</span>
            </span>
          </button>

          <NavLink to="Settings" className={`${over.navbar_item2} ${over.Settings}`}>
            <img src="/Navbar/Settings.svg" className={over.imgg} alt="Settings" />
            <span className={over.hidden_name}>Settings</span>
            <div className={getNavLinkBar("/Settings")} />
          </NavLink>

          <NavLink
            to="/login"
            onClick={check_logout}
            className={`${over.navbar_item2} ${over.Logout}`}
          >
            <img src="/Navbar/Logout.svg" className={over.imgg} alt="Logout" />
            <span className={over.hidden_name}>Logout</span>
          </NavLink>
        </div>
      </div>

      <div className={ActiveNavbar ? over.left_side : over.left_side_update}>
        <Routes>
          <Route path="/Overview" element={<Overview_Page />} />
          <Route path="/Profile/:username" element={<Choose_Profile />} />
          <Route path="/Play" element={<Play_Page />} />
          <Route path="/Friends" element={<Friends_Page />} />
          <Route path="/Leaderboard" element={<The_Leaderboard />} />
          <Route path="/Settings" element={<Settings_Page />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default Overview;