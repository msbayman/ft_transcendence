import { useEffect, useState } from "react";
import { TextField, Alert } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./Login_Page.css";

function Login_Page() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Errmsg, setErrorMessage] = useState("");
  const [panding, ispanding] = useState(false);
  const [errorpram, setErrorpram] = useState(""); // State for error parameter

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get("error");

    if (error) {
      setErrorpram(error); // Set the error parameter in state
    }

    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    if (accessToken && refreshToken) {
      Cookies.set("access_token", accessToken, { path: "/" });
      Cookies.set("refresh_token", refreshToken, { path: "/" });
      axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
        "access_token"
      )}`;
      // Navigate to the profile page and send `false` as a state variable
      navigate("/Overview", { state: { fromOAuth: false } });
    }
  }, [location, navigate]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    ispanding(true);
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/user_auth/login_simple",
        {
          username,
          password,
        }
      );

      if (response.status === 200) {
        if (response.data.twofa_required) {
          const redirectUrl = `${response.data.redirect_to}?username=${response.data.username}`;
          navigate(redirectUrl);
        } else {
          Cookies.set("access_token", response.data.access, { path: "/" });
          Cookies.set("refresh_token", response.data.refresh, { path: "/" });
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${Cookies.get("access_token")}`;
          navigate(response.data.redirect_to);
        }
      } else if (response.status === 401) {
        setErrorMessage(response.data.detail);
      }
    } catch (error) {
      ispanding(false);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
    ispanding(false);
  };

  const handleOAuthLogin = () => {
    window.location.href = "http://localhost:8000/discord/login";
  };
  const handleOAuthLogin_42 = () => {
    window.location.href = "http://localhost:8000/42/login";
  };

  return (
    <>
      <div className="main_login">
        {errorpram && (
          <Alert
            variant="filled"
            severity="error"
            onClose={() => setErrorpram("")} // Close the alert
            sx={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              width: "90%",
              maxWidth: "600px",
            }}
          >
            {errorpram}
          </Alert>
        )}
        <div className="leftContainer">
          <div className="login_left">
            <div className="left_cont">
              <div className="game_logo_login"></div>
              <Link to="/">
                <img id="logo_login" src="game_logo.svg" alt="game_logo" />
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
                  {!panding && (
                    <button id="btn_login" type="submit">
                      LOG IN
                    </button>
                  )}
                </div>
                <span className="dotted-line">
                  <div id="or">or</div>
                </span>
              </form>
              <div className="login_42_google">
                <img
                  className="auth cursor-pointer"
                  src="connect_with_google.svg"
                  alt="login google"
                  onClick={handleOAuthLogin}
                />
                <img
                  onClick={handleOAuthLogin_42}
                  className="auth cursor-pointer"
                  src="connect_with_42.svg"
                  alt="login intra"
                />
              </div>

              <div className="forget_and_singup">
                <span className="forget_pass">Don't have an account ?</span>
                <span>
                  <Link to="/signup">Sign Up ! </Link>
                </span>
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
