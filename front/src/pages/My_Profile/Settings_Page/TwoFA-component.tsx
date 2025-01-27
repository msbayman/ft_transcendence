import "./Settings_Page.css";
import { useState } from "react";
import React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useRef } from "react";
import { usePlayer } from "../PlayerContext";
import axios from "axios";
import Cookies from "js-cookie";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": {
    maxWidth: "80vw", // 80% of viewport width
    width: "40em", // maximum width in pixels
    minHeight: "365px", // minimum height
    borderRadius: "33px", // rounded corners
    position: "relative",
    left: "6%",
  },
}));

function TFA({
  setChecked,
  checked,
  email,
  username,
}: {
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  checked: boolean;
  email: string;
  username: string;
}) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const data = usePlayer();

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
          inputsRef.current[index + 1]?.focus();
        }
      }
    };

  interface HandleClickOpenProps {
    status: boolean;
  }

  const handleClickOpen = async ({
    status,
  }: HandleClickOpenProps): Promise<void> => {
    setOpen(true);

    try {
      const token = Cookies.get("access_token");

      if (!token) {
        console.log("No access token found.");
        throw new Error("No access token found.");
      }

      console.log(data.playerData?.username);
      console.log(status);

      const response = await axios.post( // line: 95
        "https://localhost:443/api/user_auth/VerifyOTPSettings/",
        {
          username: data.playerData?.username,
          state: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setError(response.data.message);
        setTimeout(() => setError(null), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send OTP");
      setTimeout(() => setError(null), 3000);
    }
  };
  const resendCode = async (): Promise<void> => {
    try {
      const token = Cookies.get("access_token");

      if (!token) {
        throw new Error("No access token found.");
      }

      const respone = await axios.post(
        "https://localhost:443/api/user_auth/resend_otp",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (respone.status === 200) {
        setError("OTP resent successfully!");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError("Failed to resend code");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    };

  const handleClose = () => {
    setOpen(false);
  };

  const checkOtpCode = async (): Promise<void> => {
    const otpString = otp.join("");
    console.log(otpString);
    if (otpString.length !== 6) {
      setError("Invalid OTP code");
      setChecked(false);
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      console.log("Start A");
      const response = await axios.post(
        "https://localhost:443/api/user_auth/VerifyOTP",
        {
          username: username,
          otp: otpString,
        }
      );
      console.log("this is respone ", response);
      if (response.status === 200) {
        setError("Verification successful!");
        setChecked(true);
        setTimeout(() => setError(null), 3000);
        handleClose();
      }
    } catch (err) {
      setError("Verification failed");
      setChecked(false);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <React.Fragment>
      <h4
        onClick={() => handleClickOpen({ status: checked })} // line: 193
        className="cursor-pointer border relative top-4 rounded-lg p-2 hover:bg-[#abe8df47]"
      >
        Activate Two-factor authentication (2FA)
      </h4>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={false}
        fullWidth
        className="backdrop-filter backdrop-blur-sm"
      >
        <DialogContent
          dividers
          className="rounded-[42px] bg-white grid grid-cols-1 relative "
        >
          <h1 className="font-manjari text-2xl relative bottom-5 flex right-3 justify-center">
            Verify Code
          </h1>
          <div className="flex justify-center items-center relative bottom-[2rem] text-lg font-manjari">
            <h4>Code has been sent to</h4>
            <h4 className="text-xl font-bold ">&nbsp;{email}</h4>
          </div>
          <div className="flex justify-center items-center">
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
                  style: {
                    textAlign: "center",
                    color: "black",
                    fontSize: "45px",
                    fontWeight: "bold",
                    fontFamily: "Manjari",
                    position: "relative",
                    top: "7px",
                    width: "59px",
                  },
                }}
                variant="outlined"
                sx={{
                  width: "59px",
                  position: "relative",
                  bottom: "1.8rem",
                  margin: "0 5px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#3C0CAB",
                      borderRadius: "9px",
                      borderWidth: "2px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#8151EE",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "red",
                  },
                }}
              />
            ))}
          </div>
          {error && (
            <div
              className={`text-center mb-4 ${
                error.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {error}
            </div>
          )}
          <div className="flex justify-center flex-col items-center relative right-7">
            <h4 className="cursor-pointer text-lg text-black font-manjari relative top-[4px] left-[2rem]">
              Didn't receive the code?
            </h4>
            <button
              className="cursor-pointer text-lg font-semibold text-[#3A0CA3] font-manjari relative top-[4px] left-[2rem] hover:text-[#8051eea8]"
              onClick={() => {
                setError("Code has been resent!");
                setTimeout(() => setError(null), 3000);
                resendCode();
              }}
            >
              Resend Code
            </button>
          </div>
          <div className="flex justify-center items-center w-[400px] h-[45px] relative rounded-[12px] left-[6.5rem] bg-[#3A0CA3]">
            <h4
              className="cursor-pointer text-2xl text-white font-manjari relative top-[4px]"
              onClick={() => {
                checkOtpCode();
                setTimeout(() => {}, 3000);
              }}
            >
              Verify
            </h4>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}

function TwoFA_Component() {
  const [checked, setChecked] = useState(false);

  const data = usePlayer();

  return (
    <>
      <div className="relative right-[22%]">
        <h4 className="relative font-size mt-[1.6rem] ">Two-Factor Authentication (2FA)</h4>
      </div>
      <div className="TwoFA">
        <p className="description">
          Enhance the security of your account by enabling Two-Factor
          Authentication (2FA). This feature adds an extra of protection,
          ensuring that only you can access. Your account, even if your password
          is compromised
        </p>
        <div className="check-TFA gap-7">
          <TFA
            setChecked={setChecked}
            checked={checked}
            email={data.playerData?.email ?? ""}
            username={data.playerData?.username ?? ""}
          />
          {checked ? (
            <div className="flex items-center justify-center text-green-400 relative top-1">
              <h4>(2FA) Activated</h4>
            </div>
          ) : (
            <div className="flex items-center justify-center text-red-400 relative top-1">
              <h4>(2FA) Deactivated</h4>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TwoFA_Component;
