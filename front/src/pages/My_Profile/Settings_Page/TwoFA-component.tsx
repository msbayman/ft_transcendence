import "./Settings_Page.css";
import { useState, useEffect } from "react";
import React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useRef } from "react";
import { usePlayer } from "../PlayerContext";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { config } from "../../../config";

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
}: {
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  checked: boolean;
  email: string;
}) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { HOST_URL } = config;
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

  const handleClickOpen = async (): Promise<void> => {
    setOpen(true);

    try {
      const token = Cookies.get("access_token");

      if (!token) {
        throw new Error("No access token found.");
      }

      const response = await axios.post(
        `${HOST_URL}/api/user_auth/SendOtpForSettings`,
        {
          username: data.playerData?.username,
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
    setOpen(true);

    try {
      const token = Cookies.get("access_token");

      if (!token) {
        throw new Error("No access token found.");
      }

      const response = await axios.post(
        `${HOST_URL}/api/user_auth/SendOtpForSettings`,
        {
          username: data.playerData?.username,
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

  const handleKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    };

  const handleClose = () => {
    setOpen(false);
  };

  const checkOtpCode = async ({
    status,
  }: HandleClickOpenProps): Promise<void> => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Invalid OTP code");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const token = Cookies.get("access_token");

      if (!token) {
        throw new Error("No access token found.");
      }
      const response = await axios.post(
        `${HOST_URL}/api/user_auth/VerifyOTPSettings`,
        {
          username: data.playerData?.username,
          otp: otpString,
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
        toast.success("Verification successful!");
        setChecked((prev) => (!prev));
        setTimeout(() => setError(null), 3000);
        handleClose();
      }
    } catch (err) {
      setError("Verification failed");
      setChecked(false);
      setTimeout(() => setError(null), 3000);
    }
  };

  const Deactivate: string =
    "cursor-pointer border-[2px] p-2 rounded-md relative top-3 transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-red-500 hover:text-white";
  const Activate: string =
    "cursor-pointer border-[2px] p-2 rounded-md relative top-3 transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#28a745] hover:text-white";
  const if_true = (status: boolean) => {
    return !status ? Activate : Deactivate;
  };

  return (
    <React.Fragment>
      <h4 onClick={() => handleClickOpen()} className={`${if_true(checked)}`}>
        {checked ? "Deactivate [2FA]" : "Activate [2FA]"}
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
          className="rounded-[42px] bg-white grid grid-cols-1 relative"
        >
          <h1 className="font-manjari text-2xl relative bottom-2 flex right-3 justify-center">
            Verify Code
          </h1>
          <div className="flex justify-center items-center relative bottom-[1rem] text-lg font-manjari">
            <h4>Code has been sent to</h4>
            <h4 className="text-xl font-bold ">&nbsp;{email}</h4>
          </div>
          <div className="flex justify-center items-center relative top-[1rem]">
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
                    fontSize: "46px",
                    fontWeight: "bold",
                    fontFamily: "Manjari",
                    position: "relative",
                    bottom: "8px",
                    width: "59px",
                  },
                }}
                variant="outlined"
                sx={{
                  width: "69px",
                  position: "relative",
                  bottom: "1.3rem",
                  margin: "0 6px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#3C0CAB",
                      height: "75px",
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
              className={`text-center absolute top-[55%] left-[37%] ${
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
                checkOtpCode({ status: checked });
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
  const data = usePlayer(); 
  const [checked, setChecked] = useState<boolean>(data.playerData?.active_2fa ?? false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { HOST_URL } = config;

  useEffect(() => {
    const fetchAndSetInitialState = async () => {
      try {
        const token = Cookies.get("access_token");
        if (!token) {
          return;
        }

        const response = await axios.get(
          `${HOST_URL}/api/user_auth/get2FAStatus`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setChecked(response.data.is2FAEnabled);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Failed to fetch 2FA status:", error);
        setChecked(data.playerData?.active_2fa ?? false);
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      fetchAndSetInitialState();
    }
  }, [data.playerData?.active_2fa, isInitialized]);

  return (
    <>
      <div className="relative right-[22%]">
        <h4 className="relative font-size mt-[1.6rem] ">
          Two-Factor Authentication (2FA)
        </h4>
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
