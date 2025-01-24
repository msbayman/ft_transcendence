import { useState, useEffect } from "react";
import over from "./Overview.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
  // useNavigate,
} from "react-router-dom";
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

function Overview() {
  const location = useLocation();
  const [showNotifications, SetshowNotifications] = useState(false);

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
  }, []);

  const Notifications_f = () => {
    SetshowNotifications((showNotifications) => !showNotifications);
  };

  const check_logout = async () => {
    const refreshToken = Cookies.get("refresh_token");
    const accessToken = Cookies.get("access_token");
    // Cookies.remove("access_token");
    // Cookies.remove("refresh_token");

    // Make the request before removing tokens
    try {
      await axios.post(
        "https://localhost/api/user_auth/LogoutAPIView/",
        { refresh_token: refreshToken },
        {
          headers:{ Authorization: `Bearer ${accessToken}` }
        }
      );
    } finally {
      // Clear tokens after the request
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
    }
  };
  const dataPlayer = usePlayer();
  // console.log( '->> path image: ' + dataPlayer.playerData?.profile_image);
  const Choose_Profile = () => {
    const { username } = useParams<{ username: string }>();
    return dataPlayer.playerData?.username === username ? (
      <Profile_Page />
    ) : (
      <Other_Profile_Page username={username} />
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
    } else if (path === "/Leadearboard") {
      return "/" + localistation.pathname.split("/")[1] === path
        ? `${over.navbar_item1} ${over.nav_color1} ${over.Shop}`
        : over.navbar_item1;
    }
  };
  const getNavLinkBar = (path: string) => {
    if (path === "/Settings") {
      return "/" + localistation.pathname.split("/")[1] === path
        ? over.selected1
        : over.selected_hide;
    } else {
      return "/" + localistation.pathname.split("/")[1] === path
        ? over.selected
        : over.selected_hide;
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
    <div className={`${over.all}`} style={{ backgroundImage: `url('/public/Navbar/Back_left_Side.png')` }}>
      {showNotifications && (
        <div className={over.notif}> {Notifications_p()} </div>
      )}
      <div
        className={ActiveNavbar ? over.cercle : over.cercle_hide}
        onClick={ClickToActive}
      >
        <img
          src="/public/Navbar/Close_Navbar.svg"
          className={ActiveNavbar ? over.Open_Navbar : over.Open_Navbar_hide}
        />
        <img
          src="/public/Navbar/Open_Navbar.svg"
          className={ActiveNavbar ? over.Open_Navbar_hide : over.Open_Navbar}
        />
      </div>
      <div
        className={
          ActiveNavbar
            ? over.right_navbar
            : `${over.Hide} ${over.Nav_right_hide}`
        }
      >
        <div className={over.the_logo}>
          <img src="/public/Navbar/Logo_ping.svg" className={`${over.imgg1} ${over.imgg1_hide}`} />
        </div>
        <div className={over.bar_search}>
          <Search />
        </div>
        <div className={over.content_navbar_item1}>
          <NavLink to={"Overview"} className={getNavLink("/Overview")}>
            <img src="/public/Navbar/Overiew.svg" className={over.imgg} />
            <span className={over.hidden_name}> Overview </span>
            <div className={getNavLinkBar("/Overview")}> </div>
          </NavLink>
          <NavLink
            to={`Profile/${dataPlayer.playerData?.username}`}
            className={getNavLink("/Profile")}
          >
            <img src="/public/Navbar/Profie.svg" className={over.imgg} />
            <span className={over.hidden_name}> Profile </span>
            <div className={getNavLinkBar("/Profile")}> </div>
          </NavLink>
          <NavLink to="Play" className={getNavLink("/Play")}>
            <img src="/public/Navbar/Play.svg" className={over.imgg} />
            <span className={over.hidden_name}> Play </span>
            <div className={getNavLinkBar("/Play")}> </div>
          </NavLink>
          <NavLink to="Friends" className={getNavLink("/Friends")}>
            <img src="/public/Navbar/Friends.svg" className={over.imgg} />
            <span className={over.hidden_name}> Friends </span>
            <div className={getNavLinkBar("/Friends")}></div>
          </NavLink>
          <NavLink to="/Leadearboard" className={getNavLink("/Leadearboard")}>
            <img src="/public/Navbar/Leaderboard_icon.png" className={over.imgg} />
            <span className={over.hidden_name}> Leaderboard </span>
            <div className={getNavLinkBar("/Leadearboard")}></div>
          </NavLink>
        </div>
        <div
          className={`${over.content_navbar_item2} ${over.content_navbar_item2_hide}`}
        >
          <div className={over.hr_cont}>
            {" "}
            <hr className={over.brr} />{" "}
          </div>
          <button onClick={Notifications_f}>
            <span className={`${over.navbar_item2} ${over.Notifications}`}>
              <img src="/public/Navbar/Notifications.svg" className={over.imgg} />
              <span className={over.hidden_name}>Notifications</span>
            </span>
          </button>
          <NavLink
            to="/Settings"
            className={`${over.navbar_item2} ${over.Settings}`}
          >
            <img src="/public/Navbar/Settings.svg" className={over.imgg} />
            <span className={over.hidden_name}> Settings </span>
            <div className={getNavLinkBar("/Settings")}></div>
          </NavLink>
          <NavLink
            to="/login"
            onClick={check_logout}
            className={`${over.navbar_item2} ${over.Logout}`}
          >
            <img src="/public/Navbar/Logout.svg" className={over.imgg} />
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
          <Route path="/Leadearboard" element={<The_Leaderboard />} />
          <Route path="/Settings" element={<Settings_Page />} />
        </Routes>
      </div>
    </div>
  );
}

export default Overview;
