import { useState, useEffect } from "react";
import "./Overview.css";
import axios from "axios";
import Cookies from "js-cookie";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import OpenNavbar from "./assets/Open_Navbar.svg";
import CloseNavbar from "./assets/Close_Navbar.svg";
import Logo_ping from "./assets/Logo_ping.svg";
import Search from "./assets/Search.svg";
import Overview_img from "./assets/Overiew.svg";
import Profile from "./assets/Profie.svg";
import Play from "./assets/Play.svg";
import Friends from "./assets/Friends.svg";
import Shop from "./assets/Shop.svg";
import Notifications from "./assets/Notifications.svg";
import Settings from "./assets/Settings.svg";
import Logout from "./assets/Logout.svg";
import Overview_Page from "./Overview_Page/Overview_Page";
import Profile_Page from "./Profile_Page/Profile_Page";
import Other_Profile_Page from "./Profile_Page/Other_Profile/Profile_Page";
import Play_Page from "./Play_Page/Play_Page";
import Friends_Page from "./Friends_Page/Friends_Page";
import Shop_Page from "./Shop_Page/Shop_Page";
import Settings_Page from "./Settings_Page/Settings_Page";
import The_Leaderboard from "./Overview_Page/Leaderboard_Page/The_Leaderboard";
import { usePlayer } from "./PlayerContext";

function Overview() {
  // interface player_data {
  //   full_name: string;
  //   username: string;
  //   email: string;
  // }
  const location = useLocation();
  // const [player_data, setplayer_data] = useState<player_data>();
  useEffect(() => {
    const state = location.state as { fromOAuth?: boolean }; // Access the state from the previous navigation
    const searchParams = new URLSearchParams(location.search);

    if (!state?.fromOAuth) {
      const accessToken = searchParams.get("access_token") as string;
      const refreshToken = searchParams.get("refresh_token") as string;

      // Store tokens in cookies
      if (accessToken && refreshToken) {
        Cookies.set("access_token", accessToken, { path: "/" });
        Cookies.set("refresh_token", refreshToken, { path: "/" });
      }
    }

    // console.log("Overview:", Cookies.get("access_token"));
    // const storedToken = Cookies.get("access_token");
    // if (storedToken) {
    //   fetchData(storedToken);
    // } else {
    //   console.log("No token found. Please log in.");
    // }
  }, []);

  // const fetchData = async (token: string) => {
  //   try {
  //     const response = await axios.get<player_data>(
  //       "http://127.0.0.1:8000/user_auth/UserDetailView",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setplayer_data(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const check_logout = async () => {
    const refreshToken = Cookies.get("refresh_token");
    const accessToken = Cookies.get("access_token");
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    
    // Make the request before removing tokens
    try {
      await axios.post(
        "http://127.0.0.1:8000/user_auth/LogoutAPIView/",
        { refresh_token: refreshToken },
        {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
        }
      );
    } finally {
      // Clear tokens after the request
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
    }
  }
  const dataPlayer = usePlayer();
  const Choose_Profile = () => {
    const { username } = useParams<{ username: string }>();
    return dataPlayer.playerData?.username === username ? (
      <Profile_Page />
    ) : (
      <Other_Profile_Page />
    );
  };
  const localistation = useLocation();

  const getNavLink = (path: string) => {
    if (path === "/Overview") {
      return "/" + localistation.pathname.split("/")[1] === path
        ? "navbar_item1 nav_color1 Overview"
        : "navbar_item1";
    } else if (path === "/Profile") {
      return "/" + localistation.pathname.split("/")[1] === path
        ? "navbar_item1 nav_color1 Profile"
        : "navbar_item1";
    } else if (path === "/Play") {
      return localistation.pathname === path
        ? "navbar_item1 nav_color1 Play"
        : "navbar_item1";
    } else if (path === "/Friends") {
      return localistation.pathname === path
        ? "navbar_item1 nav_color1 Friends"
        : "navbar_item1";
    } else if (path === "/Shop") {
      return localistation.pathname === path
        ? "navbar_item1 nav_color1 Shop"
        : "navbar_item1";
    }
  };
  const getNavLinkBar = (path: string) => {
    if (path === "/Settings") {
      return "/" + localistation.pathname.split("/")[1] === path
        ? "selected1"
        : "selected_hide";
    } else {
      return "/" + localistation.pathname.split("/")[1] === path
        ? "selected"
        : "selected_hide";
    }
  };
  const [ActiveNavbar, setActiveNavbar] = useState(false);

  const ClickToActive = () => {
    setActiveNavbar((ActiveNavbar) => !ActiveNavbar);
  };
  const CheckWindow = () => {
    if (window.innerWidth > 1000) setActiveNavbar(true);
  };
  useEffect(() => {
    CheckWindow();
    window.addEventListener("resize", CheckWindow);
    return () => {
      window.removeEventListener("resize", CheckWindow);
    };
  }, []);

  return (
    <div className="all">
      <div
        className={ActiveNavbar ? "cercle" : "cercle_hide"}
        onClick={ClickToActive}
      >
        <img
          src={CloseNavbar}
          className={ActiveNavbar ? "Open_Navbar" : "Open_Navbar_hide"}
        />
        <img
          src={OpenNavbar}
          className={ActiveNavbar ? "Open_Navbar_hide" : "Open_Navbar"}
        />
      </div>
      <div className={ActiveNavbar ? "right_navbar" : "Hide Nav_right_hide"}>
        <div className="the_logo">
          <img src={Logo_ping} className="imgg1 imgg1_hide" />
        </div>
        <div className="bar_search">
          <div className="search_content">
            <img src={Search} className="imgg" />
            <span className="hidden_name"> Search </span>
          </div>
        </div>
        <div className="content_navbar_item1">
          <NavLink to={"Overview"} className={getNavLink("/Overview")}>
            <img src={Overview_img} className="imgg" />
            <span className="hidden_name"> Overview </span>
            <div className={getNavLinkBar("/Overview")}> </div>
          </NavLink>
          <NavLink
            to={`Profile/${dataPlayer.playerData?.username}`}
            className={getNavLink("/Profile")}
          >
            <img src={Profile} className="imgg" />
            <span className="hidden_name"> Profile </span>
            <div className={getNavLinkBar("/Profile")}> </div>
          </NavLink>
          <NavLink to="Play" className={getNavLink("/Play")}>
            <img src={Play} className="imgg" />
            <span className="hidden_name"> Play </span>
            <div className={getNavLinkBar("/Play")}> </div>
          </NavLink>
          <NavLink to="Friends" className={getNavLink("/Friends")}>
            <img src={Friends} className="imgg" />
            <span className="hidden_name"> Friends </span>
            <div className={getNavLinkBar("/Friends")}></div>
          </NavLink>
          <NavLink to="Shop" className={getNavLink("/Shop")}>
            <img src={Shop} className="imgg" />
            <span className="hidden_name"> Shop </span>
            <div className={getNavLinkBar("/Shop")}></div>
          </NavLink>
        </div>
        <div className="content_navbar_item2 content_navbar_item2_hide">
          <div className="hr_cont">
            <hr className="brr" />
          </div>
          <NavLink to="/notifications" className=" navbar_item2 Notifications">
            <img src={Notifications} className="imgg" />
            <span className="hidden_name">Notifications</span>
          </NavLink>
          <NavLink to="/Settings" className=" navbar_item2 Settings">
            <img src={Settings} className="imgg" />
            <span className="hidden_name"> Settings </span>
            <div className={getNavLinkBar("/Settings")}></div>
          </NavLink>
<NavLink
  to="/logout"
  onClick={check_logout}
  className="navbar_item2 Logout"
>
  <img src={Logout} className="imgg" />
  <span className="hidden_name">Logout</span>
</NavLink>

        </div>
      </div>
      <div className={ActiveNavbar ? "left_side" : "left_side_update"}>
        <Routes>
          <Route path="/Overview" element={<Overview_Page />} />
          <Route path="/Overview/Leadearboard" element={<The_Leaderboard />} />
          <Route path="/Profile/:username" element={<Choose_Profile />} />
          <Route path="/Play" element={<Play_Page />} />
          <Route path="/Friends" element={<Friends_Page />} />
          <Route path="/Shop" element={<Shop_Page />} />
          <Route path="/Settings" element={<Settings_Page />} />
        </Routes>
      </div>
    </div>
  );
}

export default Overview
