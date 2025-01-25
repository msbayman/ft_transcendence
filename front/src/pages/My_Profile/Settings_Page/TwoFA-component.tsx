import "./Settings_Page.css";
import { useState } from "react";
import React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useRef } from "react";


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
    minHeight: "300px", // minimum height
    borderRadius: "42px", // rounded corners
    position: "relative",
    left: "6%",
  },
}));


function TFA( {setChecked}: {setChecked: React.Dispatch<React.SetStateAction<boolean>>}, {email}: {email: string}) {
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

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

  const handleClickOpen = async () => {

    setOpen(true);
    // send request to backend to enable 2FA and send otp code to email 
    // if success then show dialog
    // if failed show error message
    // if otp code is correct then setChecked(true)



  };

  const handleKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputsRef.current[index - 1].focus();
      }
    };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <React.Fragment>
      <h4 onClick={handleClickOpen} className="cursor-pointer border p-2 hover:bg-[#abe8df47]">Activate Two-factor authentication (2FA)</h4>
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
          <h1 className="font-alexandria text-2xl relative bottom-5 flex right-3 justify-center">
          Verify Code
          </h1>
          <div className="bg-green-400">
            <h4>Code has been sent to {email}</h4>
          </div>
          <div className="flex justify-center items-center bg-red-500">
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
          </div>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}

function TwoFA_Component( playerData: any ) {
  const [checked, setChecked] = useState(false);

  const data = playerData.playerData;


  return (
    <>
      <div className="relative right-[22%]">
        <h1 className="text-container TFA">Two-Factor Authentication (2FA)</h1>
      </div>
      <div className="TwoFA">
        <p className="description">
          Enhance the security of your account by enabling Two-Factor
          Authentication (2FA). This feature adds an extra of protection,
          ensuring that only you can access. Your account, even if your password
          is compromised
        </p>
        <div className="check-TFA gap-7">
          <TFA  setChecked={setChecked} email={playerData.email} />
          {checked ? (
              <div className="flex flex-col items-center justify-center text-green-500">
              <h4 className="cursor-pointer">(2FA) Activated</h4>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-red-500">
              <h4 className="cursor-pointer">(2FA) Deactivated</h4>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default TwoFA_Component;
