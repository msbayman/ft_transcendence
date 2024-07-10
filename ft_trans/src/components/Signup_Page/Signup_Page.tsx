import { useState, FormEvent } from 'react';
import { TextField } from "@mui/material";
import "./Signup_Page.css";
import { Link, useNavigate } from "react-router-dom";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const SignupSchema = z.object({
  full_name: z.string().min(7, { message: "Full name must be between 7 and 30 characters" }).max(30),
  username: z.string().min(3, { message: "Username must be between 3 and 15 characters" }).max(15),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be between 6 and 30 characters" }).max(30),
  re_password: z.string().min(6, { message: "Password must be between 6 and 30 characters" }).max(30),
}).refine(data => data.password === data.re_password, {
  message: "Passwords don't match",
  path: ["re_password"],
});








function Signup_Page() {
  const [mailUsernameErr, setMailUsernameErr] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (formData: any) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/user_auth/add_player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setMailUsernameErr("Username or Email already used !! ")
        // const errorData = await response.json();
        // console.log('Response:', errorData);  // Log the response for debugging
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
            <form className="signup_form" onSubmit={handleSubmit(onSubmit)}>
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
                  {...register('full_name')}
                  variant="standard"
                  error={!!errors.full_name}
                  helperText={errors.full_name ? errors.full_name.message as string : ''}
                  sx={{
                    width: "150%",
                    "& .MuiInputBase-input": {
                      color: "white",
                      fontSize: "1.25rem",
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
              <div className="div_username_s input_fld">
                <TextField
                  id="f_Username_sign"
                  label="Username"
                  {...register('username')}
                  variant="standard"
                  error={!!errors.username}
                  helperText={errors.username ? errors.username.message as string : ''}
                  sx={{
                    width: "150%",
                    "& .MuiInputBase-input": {
                      color: "white",
                      fontSize: "1.25rem",
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
              <div className="div_email_s input_fld">
                <TextField
                  id="f_Email_sign"
                  label="Email"
                  {...register('email')}
                  variant="standard"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message as string : ''}
                  sx={{
                    width: "150%",
                    "& .MuiInputBase-input": {
                      color: "white",
                      fontSize: "1.25rem",
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
              <div className="div_pw_s input_fld">
                <TextField
                  id="f_pw_sign"
                  label="Password"
                  {...register('password')}
                  type="password"
                  variant="standard"
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message as string : ''}
                  sx={{
                    width: "150%",
                    "& .MuiInputBase-input": {
                      color: "white",
                      fontSize: "1.25rem",
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
              <div className="div_r_pw_s input_fld">
                <TextField
                  id="f_rpw_sign"
                  label="Re-Password"
                  {...register('re_password')}
                  type="password"
                  variant="standard"
                  error={!!errors.re_password}
                  helperText={errors.re_password ? errors.re_password.message as string : ''}
                  sx={{
                    width: "150%",
                    "& .MuiInputBase-input": {
                      color: "white",
                      fontSize: "1.25rem",
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
                  {mailUsernameErr && <p className ="err_field " >{mailUsernameErr}</p>}

              </div>

              <button id="btn_signup" type="submit">
                Sign Up
              </button>

              <div className="no_acc_or_log">
                <span className="no_acc">Do you have an account ?</span>
                <span>
                  <Link to="/login" id="sign_in">Sign in</Link>
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
