import { TextField } from "@mui/material";
import "./Signup_Page.css";

function Signup_Page() {
  return (
    <>
      <div className="main_signup">
        <div className="signup_left">
          <div className="title_signup">JOIN US NOW !</div>
          <div className="img_signup_ping">
            <img
              src="Signup_page/ping pong table sign_up.svg"
              alt="ping pong table"
            />
          </div>
        </div>
        <div className="rightContainer">
          <div className="signup_right">
            <div className="right_cont">
              <img id="logo_signup" src="logo_game.png" alt="game_logo" />
              <div className="signup_form">
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
                  <span className="dotted-line">
                  <div id="or">or</div>
                </span>

                
                <div className="div_fullname_s input_fld">
                  <TextField
                    id="f_full_name_sign input_fld"
                    label="Full name"
                    maxRows={4}
                    variant="standard"
                    sx={{
                      width: "150%", // Adjust width as needed
                      "& .MuiInputBase-input": {
                        color: "white", // Text color
                        fontSize: "1.25rem", // Adjust font size
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
                <div className="div_username_s input_fld">
                  <TextField
                    id="f_Username_sign"
                    label="Username"
                    maxRows={4}
                    variant="standard"
                    sx={{
                      width: "150%", // Adjust width as needed
                      "& .MuiInputBase-input": {
                        color: "white", // Text color
                        fontSize: "1.25rem", // Adjust font size
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
                </div><div className="div_email_s input_fld">
                  <TextField
                    id="f_Email_sign"
                    label="Email"
                    maxRows={4}
                    variant="standard"
                    sx={{
                      width: "150%", // Adjust width as needed
                      "& .MuiInputBase-input": {
                        color: "white", // Text color
                        fontSize: "1.25rem", // Adjust font size
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
                <div className="div_pw_s input_fld">
                  <TextField
                    id="f_pw_sign"
                    label="Password"
                    type="password"
                    maxRows={4}
                    variant="standard"
                    sx={{
                      width: "150%", // Adjust width as needed
                      "& .MuiInputBase-input": {
                        color: "white", // Text color
                        fontSize: "1.25rem", // Adjust font size
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
                </div><div className="div_r_pw_s input_fld">
                  <TextField
                    id="f_rpw_sign"
                    label="Re-Password"
                    type="password"
                    maxRows={4}
                    variant="standard"
                    sx={{
                      width: "150%", // Adjust width as needed
                      "& .MuiInputBase-input": {
                        color: "white", // Text color
                        fontSize: "1.25rem", // Adjust font size
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


                <button id="btn_signup">Sign Up</button>

                <div className="no_acc_or_log">
                <span className="no_acc">Do you have an account ?</span>
                <span>Login</span>
              </div>





              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup_Page;
