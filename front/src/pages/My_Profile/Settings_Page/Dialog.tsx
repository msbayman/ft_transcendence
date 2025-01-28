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
    borderRadius: "42px", // rounded corners
    position: "relative",
    left: "6%",
  },
}));

const SLIDEIMAPS = [
  { caverPath: "Covers/img.svg", id: 0, coverName: "1v1" },
  { caverPath: "Covers/img1.svg", id: 1, coverName: "2v2" },
  { caverPath: "Covers/img2.svg", id: 2, coverName: "vsBot" },
  { caverPath: "Covers/tenis.svg", id: 3, coverName: "Tournement" },
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

  // const handleSave = async () => {
  //   // try {
  //   handleClose();
  //   const token = Cookies.get("access_token");
  //   if (!token) {
  //     throw new Error("No access token found.");
  //   }

  //   const request = await axios.post(
  //     "https://localhost/api/user_auth/change_cover",
  //     updateData,
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
  //   // } catch (error) {}
  // };


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
          className="rounded-[42px] bg-white grid grid-cols-1 relative "
        >
          <h1 className="font-alexandria relative top-5 text-4xl text-center">
            Choose Your Cover
          </h1>
          <div className="flex flex-col items-center relative top-[3em]">
            <div className="flex flex-wrap justify-evenly gap-5 w-[90rem] h-[33rem]">
              {SLIDEIMAPS.map((slide, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer flex justify-center rounded-[36px] h-[200px] ${
                    selectedImage === slide.caverPath
                      ? "ring-4 ring-[#8151EE]"
                      : ""
                  }`}
                  onClick={() => handleImageSelect(slide.caverPath)}
                >
                  <img
                    src={slide.caverPath}
                    alt={`Cover option ${index + 1}`}
                    className="w-[40em] h-auto max-w-[90em] rounded-[36px]"
                  />
                  {selectedImage === slide.caverPath && (
                    <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                      <FontAwesomeIcon icon={faCheck} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="w-full flex justify-center relative top-[5.3rem] items-center h-[4rem] ">
              <button
                onClick={async () => {
                  console.log(selectedImage);
                  
                  // try {
                  //   const token = Cookies.get("access_token");
                  //   if (!token) {
                  //     throw new Error("No access token found.");
                  //   }

                  //   interface SelectedImage {
                  //     cover_image: string;
                  //   }

                  //   const updateData: SelectedImage = {
                  //     cover_image: selectedImage,
                  //   };

                  //   console.log(updateData);

                  //   const request = await axios.post(
                  //     "https://localhost/api/user_auth/change_cover",
                  //     {
                  //       cover: updateData,
                  //     },
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
                  // } catch (error) {
                  //   console.error("Failed to update cover image:", error);
                  // }
                }}
                className="bg-[#8151EE] font-alexandria w-[15rem] h-[42px] text-[16px] shadow-md relative bottom-[7rem] flex justify-center items-center text-white p-2 rounded-[36.5px] hover:bg-white hover:text-[#3a0ca3]"
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
