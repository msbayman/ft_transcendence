import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
// import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": {
    maxWidth: "80vw", // 80% of viewport width
    width: "90em", // maximum width in pixels
    minHeight: "600px", // minimum height
    borderRadius: "118px", // rounded corners
    position: "relative",
    left: "6%",
  },
}));

const SLIDEIMAPS = [
  { mapPath: "1v1.png", id: 0, mapName: "1v1" },
  { mapPath: "2v2.png", id: 1, mapName: "2v2" },
  { mapPath: "vsBot.png", id: 2, mapName: "vsBot" },
  { mapPath: "Tourn.png", id: 3, mapName: "Tournement" },
];

interface CustomizedDialogsProps {
  setSelectedCover: (cover: string) => void;
  currentCover: string;
}

export default function CustomizedDialogs({
  setSelectedCover,
  currentCover,
}: CustomizedDialogsProps) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(currentCover);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageSelect = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  const handleSave = async () => {
    // try {
    //   const token = Cookies.get("access_token");
    //   if (!token) {
    //     throw new Error("No access token found.");
    //   }

    //   const request = await axios.post(
    //     "https://localhost/api/user_auth/change_cover",
    //     selectedImage,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );

    //   if (request.status === 200) {
    //     toast.success("Cover image updated successfully");
    //     setSelectedCover(selectedImage);
    //     window.location.reload();
    //   }
      handleClose();
    // } catch (error) {}
  };

  return (
    <React.Fragment>
      <h4 onClick={handleClickOpen}>change cover</h4>
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
          className="rounded-[118px] bg-white grid grid-cols-1 relative "
        >
          <h1 className="font-alexandria relative bottom-5">
            Choose Your Cover
          </h1>
          <div className="flex flex-col items-center relative bottom-[3em]">
            <div className="flex flex-wrap justify-evenly gap-3">
              {SLIDEIMAPS.map((slide, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointerflex justify-start rounded-xl ${
                    selectedImage === slide.mapPath
                      ? "ring-4 ring-[#FF0000]"
                      : ""
                  }`}
                  onClick={() => handleImageSelect(slide.mapPath)}
                >
                  <img
                    src={slide.mapPath}
                    alt={`Cover option ${index + 1}`}
                    className="w-[30em] h-auto max-w-xl"
                  />
                  {selectedImage === slide.mapPath && (
                    <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                      <FontAwesomeIcon icon={faCheck} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="w-full flex justify-center relative top-7 items-center h-[90%] ">
              <button
                onClick={handleSave}
                className="bg-blue-500 w-[10%] text-lg relative bottom-2 flex justify-center text-white p-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
