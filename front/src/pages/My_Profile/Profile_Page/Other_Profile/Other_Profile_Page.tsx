import other from "./Profile_Page.module.css";
import Info_Player from "./Info_Player";
import Acheiev_Profile from "./Acheiev_Profile";
import States_Profile from "./States_Profile";
import Recent_Game from "./Recent_Game";
import Action_Friends from "./Action_Friends";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { data_of_player } from "./interface";
import { config } from "../../../../config";

export const Other_Profile_Page = ({
  username,
}: {
  username: string | undefined;
}) => {
  const token = Cookies.get("access_token");
  const { HOST_URL } = config;
  const [data, Setdata] = useState<data_of_player | null>(null);
  const [data_ok, Setdata_ok] = useState(false);
  const [notFound, setnotFound] = useState(false);

  const get_data = async () => {
    try {
      const response = await fetch(
        `${HOST_URL}/api/user_auth/get-player/${username}/`,
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
  }, []);

  const navigate = useNavigate();
  const to_home = () => {
    navigate("/Overview");
  };

  if (notFound === true && !data)
    return (
      <div className={other.NotFound}>
        <img src="/ERROR_404.gif" className="rounded-[30px] mt-[20px] h-[350px]" alt="Error_404" />
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
              backgroundImage: `url("${HOST_URL}${data?.cover_image}")`,
            }}
          ></div>
          <div className={other.content_profile}>
            <div className={other.details_of_profile}>
              <Info_Player username={username} />
            </div>
            <div className={other.Recent_Game}>
              <Recent_Game other_data={data} />
            </div>
            <div className={other.Acheivement_and_States}>
              <div className={other.action_to_accept}>
                <Action_Friends username={username} />
              </div>
              <div className={other.Content_of_Acheievment}>
                <Acheiev_Profile other_data={data} />
              </div>
              <div className={other.Content_of_States}>
                <States_Profile other_data={data} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Other_Profile_Page;
