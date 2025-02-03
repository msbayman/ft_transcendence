import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, ChangeEvent, FormEvent, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import "./Valid_otp.css";
import { config } from "../../config";

const ValidOtp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [errMsg, setErrMsg] = useState<string>("");
  const navigate = useNavigate();
  const username = searchParams.get("username");
const { HOST_URL } = config;
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handlePaste = (code: string) => {
    if (code.length === 6) {
      const newOtp = code.split("");
      setOtp(newOtp);
      newOtp.forEach((digit, index) => {
        if (inputsRef.current[index]) {
          inputsRef.current[index]!.value = digit;
        }
      });
      inputsRef.current[5]?.focus();
    } else alert("you need 6 digits");
  };

  const handleOtpChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^[0-9]?$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
          inputsRef.current[index + 1].focus();
        }
      }
    };

  const handleKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputsRef.current[index - 1].focus();
      }
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = otp.join("");

    try {
      const response = await axios.post(
        `${HOST_URL}/api/user_auth/VerifyOTP`,
        {
          username,
          otp: otpCode,
        }
      );

      if (response.status === 200) {
        Cookies.set("access_token", response.data.access, { path: "/" });
        axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
          "access_token"
        )}`;

        navigate(response.data.redirect_to);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setErrMsg(error.response.data.detail);
      } else {
        setErrMsg("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="bd_otp">
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form_otp"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
        sx={{
          border: "2px solid white",
          padding: 8,
          borderRadius: 4,
          backgroundColor: "#130150",
        }}
      >
        <Typography variant="h6" mb={2} sx={{ color: "white" }}>
          Hello, {username}
        </Typography>
        <Box display="flex" justifyContent="space-between" mb={2}>
          {otp.map((digit, index) => (
            <TextField
              onPaste={(e) => handlePaste(e.clipboardData.getData("text"))}
              key={index}
              inputRef={(el) => (inputsRef.current[index] = el)}
              value={digit}
              onChange={handleOtpChange(index)}
              onKeyDown={handleKeyDown(index)}
              inputProps={{
                maxLength: 1,
                style: { textAlign: "center", color: "white" },
              }}
              variant="outlined"
              sx={{
                width: "40px",
                margin: "0 4px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
              }}
            />
          ))}
        </Box>

        <Button
          type="submit"
          variant="contained"
          style={{
            backgroundColor: "#300488",
            color: "white",
          }}
        >
          {" "}
          save{" "}
        </Button>
        {errMsg && (
          <Alert
            variant="filled"
            severity="error"
            sx={{ marginTop: 2, color: "white", backgroundColor: "red" }}
          >
            {errMsg}
          </Alert>
        )}
      </Box>
      <div className="text-white font-alexandria font-medium">Warning Check : If doesn't work log again or wait your email !</div>
    </div>

  );
};

export default ValidOtp;
