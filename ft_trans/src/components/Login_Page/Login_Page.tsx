import { useState } from "react";
import { TextField } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./Login_Page.css";

function Login_Page() {


  interface player_form {
    full_name: string;
    username: string;
    email: string;
  }

  const [player_form, setplayer_form] = useState<player_form[]>([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Errmsg, setErrorMessage] = useState("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/user_auth/login_player", {
        username,
        password,
      });

      const data = response.data;
      if (response.status === 200) {
        Cookies.set('access_token', data.access, { path: '/' });
        Cookies.set('refresh_token', data.refresh, { path: '/' });
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('access_token')}`;





        const fetchData = async () => {
          try {
            const response2 = await axios.get<player_form[]>('http://127.0.0.1:8000/user_auth/display_users');
            setplayer_form(response2.data);
          } catch (error) {
            console.error(error);
          }
        };

        fetchData();
        let i= 0;
        while(player_form[i])
          console.log(player_form[i++]);

        alert("done!");
      }
      else if (response.status === 401) {
        setErrorMessage(data.detail);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <>
      <div className="main_login">
        <div className="leftContainer">
          <div className="login_left">
            <div className="left_cont">
              <div className="game_logo_login"></div>
              <Link to="/">
                <img id="logo_login" src="logo_game.png" alt="game_logo" />
              </Link>

              <form className="login_form" onSubmit={handleSubmit}>
                <div className="div_mail">
                  <TextField
                    id="Username_f"
                    label="Username"
                    maxRows={4}
                    required
                    variant="standard"
                    value={username}
                    onChange={handleUsernameChange}
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-input": {
                        color: "white",
                        fontSize: "1.25rem",
                        backgroundColor: "transparent",
                      },
                      "& .MuiInputLabel-root": {
                        color: "white",
                        fontSize: "1.25rem",
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: "white",
                      },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottomColor: "white",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: "white",
                      },
                      "& .MuiFormHelperText-root": {
                        color: "white",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "white",
                      },
                    }}
                  />
                </div>
                <div className="div_pw">
                  <TextField
                    required
                    id="pw_f"
                    label="Password"
                    type="password"
                    maxRows={4}
                    variant="standard"
                    value={password}
                    onChange={handlePasswordChange}
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-input": {
                        color: "white",
                        fontSize: "1.25rem",
                        backgroundColor: "transparent",
                      },
                      "& .MuiInputLabel-root": {
                        color: "white",
                        fontSize: "1.25rem",
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: "white",
                      },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottomColor: "white",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: "white",
                      },
                      "& .MuiFormHelperText-root": {
                        color: "white",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "white",
                      },
                    }}
                  />
                  {Errmsg && <p id="err_msg">Invalid username or password</p>}
                </div>

                <div className="login_btn_forget">
                  <div className="forget_pass">Forgot Password ?</div>
                  <button id="btn_login" type="submit">LOG IN</button>
                </div>
                <span className="dotted-line">
                  <div id="or">or</div>
                </span>
              </form>
              <div className="login_42_google">
                <img
                  className="auth"
                  src="connect_with_google.svg"
                  alt="login google"
                />
                <img
                  className="auth"
                  src="connect_with_42.svg"
                  alt="login intra"
                />
              </div>

              <div className="forget_and_singup">
                <span className="forget_pass">Don't have an account ?</span>
                <span><Link to="/signup">Sign Up ! </Link></span>
              </div>
            </div>
          </div>
        </div>

        <div className="login_right">
          <div className="title_login">WELCOME PLAYER!</div>
          <div className="img_login_ping">
            <img src="Login_page/ping pong table.svg" alt="ping pong table" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Login_Page;
