import { TextField, colors } from "@mui/material";
import "./Login_Page.css";
import { Link } from "react-router-dom";

function Login_Page() {
  return (
    <>
      <div className="main_login">
        <div className="leftContainer">
          <div className="login_left">
            <div className="left_cont">
              <div className="game_logo_login"></div>
              <Link to="/"><img id="logo_login" src="logo_game.png" alt="game_logo" /></Link>
            
              <div className="login_form">
                <div className="div_mail">
                  <TextField
                    id="email_f"
                    label="Email"
                    maxRows={4}
                    variant="standard"
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
                  <button id="btn_login">LOG IN</button>
                </div>
                <span className="dotted-line">
                  <div id="or">or</div>
                </span>
              </div>
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
          <div className="title_login"> WELCOME PLAYER !</div>
          <div className="img_login_ping">
            <img src="Login_page/ping pong table.svg" alt="ping pong table" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Login_Page;
