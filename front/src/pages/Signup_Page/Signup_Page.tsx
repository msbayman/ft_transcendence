import "./Signup_Page.css";
import { TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const fullNameSchema = z
  .string()
  .regex(/^[a-zA-Z ]+$/, { message: "Only letters and spaces allowed" })
  .min(2, { message: "Must be 2-40 characters" })
  .max(40, { message: "Must be 2-40 characters" });

const userNameSchema = z
  .string()
  .regex(/^[a-zA-Z0-9-_]+$/, { message: "Only letters, 0-9 , _ , -" })
  .min(2, { message: "Must be 2-40 characters" })
  .max(40, { message: "Must be 2-40 characters" });

const SignupSchema = z
  .object({
    full_name: fullNameSchema,
    username: userNameSchema,
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(6, { message: "Must be 6-40 characters" }).max(30),
    re_password: z
      .string()
      .min(6, { message: "Must be 6-40 characters" })
      .max(40),
  })
  .refine((data) => data.password === data.re_password, {
    message: "Passwords don't match",
    path: ["re_password"],
  });

function Signup_Page() {
  const [mailUsernameErr, setMailUsernameErr] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (formData: any) => {
    const dataToSubmit = {
      ...formData,
      id_prov: "",
      prov_name: "",
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/user_auth/add_player",
        dataToSubmit
      );

      if (response.status === 201) {
        reset();
        navigate("/login");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.non_field_errors) {
          setMailUsernameErr(errorData.non_field_errors.join(", "));
        } else if (errorData.username) {
          setMailUsernameErr(errorData.username.join(", "));
        } else if (errorData.email) {
          setMailUsernameErr(errorData.email.join(", "));
        } else {
          setMailUsernameErr("An unknown error occurred. Please try again.");
        }
      } else {
        setMailUsernameErr("An unknown error occurred. Please try again.");
      }
    }
  };

  const handleOAuthLogin = () => {
    window.location.href = "http://localhost:8000/discord/login";
  };
  const handleOAuthLogin_42 = () => {
    window.location.href = "http://localhost:8000/42/login";
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
            <Link to="/">
              {" "}
              <img id="logo_signup" src="game_logo.svg" alt="game_logo" />
            </Link>
            <form className="signup_form" onSubmit={handleSubmit(onSubmit)}>
              <img
                className="auth cursor-pointer"
                onClick={handleOAuthLogin}
                src="connect_with_google.svg"
                alt="login google"
              />
              <img
                className="auth cursor-pointer"
                onClick={handleOAuthLogin_42}
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
                  {...register("full_name")}
                  variant="standard"
                  error={!!errors.full_name}
                  helperText={
                    errors.full_name ? (errors.full_name.message as string) : ""
                  }
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
                  {...register("username")}
                  variant="standard"
                  error={!!errors.username}
                  helperText={
                    errors.username ? (errors.username.message as string) : ""
                  }
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
                  {...register("email")}
                  variant="standard"
                  error={!!errors.email}
                  helperText={
                    errors.email ? (errors.email.message as string) : ""
                  }
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
                  {...register("password")}
                  type="password"
                  variant="standard"
                  error={!!errors.password}
                  helperText={
                    errors.password ? (errors.password.message as string) : ""
                  }
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
                  {...register("re_password")}
                  type="password"
                  variant="standard"
                  error={!!errors.re_password}
                  helperText={
                    errors.re_password
                      ? (errors.re_password.message as string)
                      : ""
                  }
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
                {mailUsernameErr && (
                  <p className="err_field">{mailUsernameErr}</p>
                )}
              </div>

              <button id="btn_signup" type="submit">
                Sign Up
              </button>

              <div className="no_acc_or_log">
                <span className="no_acc">Do you have an account ?</span>
                <span>
                  <Link to="/login" id="log_in">
                    login
                  </Link>
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
