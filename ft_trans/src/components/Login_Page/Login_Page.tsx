import { TextField } from "@mui/material";
import "./Login_Page.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function Login_Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    const response = await fetch("http://127.0.0.1:8000/user_auth/login_player", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Response from server:", data);
    // Add additional logic to handle the response, such as redirecting the user or displaying a message
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
                    id="email_f"
                    label="Email"
                    maxRows={4}
                    variant="standard"
                    value={email} // Add this line
                    onChange={handleEmailChange} // Add this line
                    sx={{
                      width: "100%", // Adjust width as needed
                      "& .MuiInputBase-input": {
                        color: "white", // Text color
                        fontSize: "1.25rem", // Adjust font size
                        backgroundColor: "transparent", // Ensure the input background is transparent
                      },
                      "& .MuiInputLabel-root": {
                        color: "white", // Label color
                        fontSize: "1.25rem", // Adjust font size for the label
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: "white", // Default underline color
                      },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottomColor: "white", // Hover underline color
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: "white", // Focused underline color
                      },
                      "& .MuiFormHelperText-root": {
                        color: "white", // Helper text color
                      },
                      "& .MuiSvgIcon-root": {
                        color: "white", // Icon color
                      },
                    }}
                  />
                </div>
                <div className="div_pw">
                  <TextField
                    id="pw_f"
                    label="Password"
                    type="password"
                    maxRows={4}
                    variant="standard"
                    value={password} // Add this line
                    onChange={handlePasswordChange} // Add this line
                    sx={{
                      width: "100%", // Adjust width as needed
                      "& .MuiInputBase-input": {
                        color: "white", // Text color
                        fontSize: "1.25rem", // Adjust font size
                        backgroundColor: "transparent", // Ensure the input background is transparent
                      },
                      "& .MuiInputLabel-root": {
                        color: "white", // Label color
                        fontSize: "1.25rem", // Adjust font size for the label
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: "white", // Default underline color
                      },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottomColor: "white", // Hover underline color
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: "white", // Focused underline color
                      },
                      "& .MuiFormHelperText-root": {
                        color: "white", // Helper text color
                      },
                      "& .MuiSvgIcon-root": {
                        color: "white", // Icon color
                      },
                    }}
                  />
                </div>

                <div className="login_btn_forget">
                  <div className="forget_pass">Forgot Password ?</div>
                  <button id="btn_login" type="submit">LOG IN</button> {/* Add type="submit" */}
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
