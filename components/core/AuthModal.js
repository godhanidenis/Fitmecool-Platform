import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import SignIn from "../sections/auth-section/signin";
import SignUp from "../sections/auth-section/signup";
import { AuthTypeModal } from "./Enum";
import { CustomAuthModal } from "./CustomMUIComponents";
import Router from "next/router";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "1200px",
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  borderRadius: "12px",
  height: "auto",
};

const AuthModal = (props) => {
  const { open, handleClose, authTypeModal, setAuthTypeModal } = props;

  const [isScreenWide, setIsScreenWide] = useState(false);
  const { themeLayout } = useSelector((state) => state.themeLayout);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1023) {
        // 1023 is the lg breakpoint in Tailwind
        setIsScreenWide(true);
      } else {
        setIsScreenWide(false);
      }
    };

    handleResize(); // Check on component mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (themeLayout === "webScreen" && open && isScreenWide) {
      Router.push("/auth/signin");
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScreenWide, open, themeLayout]);

  return (
    <CustomAuthModal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="animate__animated animate__slideInDown"
    >
      <Box sx={style}>
        {authTypeModal === AuthTypeModal.Signin && (
          <SignIn
            changeAuthModalType={setAuthTypeModal}
            handleClose={handleClose}
          />
        )}
        {authTypeModal === AuthTypeModal.Signup && (
          <SignUp
            changeAuthModalType={setAuthTypeModal}
            handleClose={handleClose}
          />
        )}
      </Box>
    </CustomAuthModal>
  );
};

export default AuthModal;
