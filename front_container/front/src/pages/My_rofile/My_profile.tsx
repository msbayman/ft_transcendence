import { useState , useEffect} from "react";
import "./My_profile.css";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate, useLocation } from "react-router-dom";

function My_profile() {
  interface player_data {
    full_name: string;
    username: string;
    email: string;
  }
  const location = useLocation();
  const [player_data, setplayer_data] = useState<player_data>();
  useEffect(() => {
    
    const state = location.state as { fromOAuth?: boolean }; // Access the state from the previous navigation
    const searchParams = new URLSearchParams(location.search);

    if (!state?.fromOAuth) {
      const accessToken = searchParams.get('access_token') as string;
      const refreshToken = searchParams.get('refresh_token') as string;

      // Store tokens in cookies
      if (accessToken && refreshToken) {
        Cookies.set('access_token', accessToken, { path: '/' });
        Cookies.set('refresh_token', refreshToken, { path: '/' });
      }
    }


    console.log("my_profile:", Cookies.get('access_token'))
    const storedToken = Cookies.get("access_token");
    if (storedToken) {
      fetchData(storedToken);
    } else {
      console.log("No token found. Please log in.");
    }
  }, []);

  const fetchData = async (token: string) => {
    try {
      const response = await axios.get<player_data>(
        "http://127.0.0.1:8000/user_auth/UserDetailView",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setplayer_data(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
<div className="main_profile">
      <p>username : {player_data?.username}</p>
      <p>full name: {player_data?.full_name}</p>
      <p>email : {player_data?.email}</p>
    </div>
  );
}

export default My_profile;
