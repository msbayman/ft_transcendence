import { useState, FormEvent } from 'react';
import { TextField } from "@mui/material";
import "./Signup_Page.css";
import { Link, useNavigate } from "react-router-dom";
import{z} from "zod";

function Signup_Page() {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    re_password: '',
  });
  const navigate = useNavigate(); // Initialize useNavigate


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/user_auth/add_player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Response:', errorData);  // Log the response for debugging
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      console.log('Success:', data);

      navigate('/login'); // Redirect to login page after successful submission
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
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
            <Link to="/"> <img id="logo_signup" src="logo_game.png" alt="game_logo" /></Link>
            <form className="signup_form" onSubmit={handleSubmit}>
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
                  id="f_full_name_sign"
                  label="Full name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
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
                <text className ="err_field "></text>
              </div>
              <div className="div_username_s input_fld">
                <TextField
                  id="f_Username_sign"
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
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
                <text className ="err_field "></text>
              </div>
              <div className="div_email_s input_fld">
                <TextField
                  id="f_Email_sign"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  <text className ="err_field "></text>
              </div>
              <div className="div_pw_s input_fld">
                <TextField
                  id="f_pw_sign"
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
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
                  <text className ="err_field "></text>
              </div>
              <div className="div_r_pw_s input_fld">
                <TextField
                  id="f_rpw_sign"
                  label="Re-Password"
                  name="re_password"
                  type="password"
                  value={formData.re_password}
                  onChange={handleChange}
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
                  <text className ="err_field "></text>
              </div>

              <button id="btn_signup" type="submit">
                Sign Up
              </button>

              <div className="no_acc_or_log">
                <span className="no_acc">Do you have an account ?</span>
                <span>
                  <Link to="/login">Login</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup_Page;
