import other from "./Profile_Page.module.css";
import Info_Player from "./Info_Player";
import Acheiev_Profile from "./Acheiev_Profile";
import States_Profile from "./States_Profile";
import Recent_Game from "./Recent_Game";
import Action_Friends from "./Action_Friends";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const Other_Profile_Page = ({
  username,
}: {
  username: string | undefined;
}) => {
  interface data_of_player {
    username: string;
    level: number;
    total_games: number;
    win_games: number;
    lose_games: number;
    points: number;
    profile_image: string;
    cover_image: string;
  }

  const token = Cookies.get("access_token");

  const [data, Setdata] = useState<data_of_player | null>(null);
  const [data_ok, Setdata_ok] = useState(false);
  const [notFound, setnotFound] = useState(false);

  const get_data = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user_auth/get-player/${username}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const info = await response.json();
        Setdata(info);
        Setdata_ok(true);
      } else {
        setnotFound(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    if (data_ok === false) {
    get_data();
    }
  }, [username]);

  const navigate = useNavigate();
  const to_home = () => {
    navigate("/Overview")
  }

  if (notFound === true && !data)
    return (
      <div className={other.NotFound}>
        <div className={other.Title}>Oops!</div>
        <div className={other.Title_sub}>404 - USER NOT FOUND</div>
        <button onClick={to_home} className={other.to_Home}>
          Back to Home ..
        </button>
      </div>
    );

  return (
    <div className={other.Profile_Page_all}>
      {data_ok && (
        <div className={other.all_content_Profile}>
          <div
            className={other.cover_profile}
            style={{
              backgroundImage: `url("http://127.0.0.1:8000${data?.cover_image}")`,
            }}
          ></div>
          <div className={other.content_profile}>
            <div className={other.details_of_profile}>
              <Info_Player username={username} />
            </div>
            <div className={other.Recent_Game}>
              <Recent_Game />
            </div>
            <div className={other.Acheivement_and_States}>
              <div className={other.action_to_accept}>
                <Action_Friends username={username} />
              </div>
              <div className={other.Content_of_Acheievment}>
                <Acheiev_Profile />
              </div>
              <div className={other.Content_of_States}>
                <States_Profile />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Other_Profile_Page;
