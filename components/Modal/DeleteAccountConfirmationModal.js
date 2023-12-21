import React from "react";
import { CustomAuthModal } from "../core/CustomMUIComponents";
import { Box, Button, CircularProgress } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  maxWidth: "1200px",
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  borderRadius: "12px",
  height: "auto",
};

const DeleteAccountConfirmationModal = ({
  deleteModalOpen,
  setDeleteModalOpen,
  onClickItemDelete,
  setDeleteSelected,
  deleteLoader,
}) => {
  return (
    <CustomAuthModal
      open={deleteModalOpen}
      onClose={() => {
        setDeleteModalOpen(false);
        setDeleteSelected(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="animate__animated animate__slideInDown"
    >
      <Box sx={style} className="!w-[90%] lg:!w-2/5">
        <div className="p-5">
          <div className="flex items-center">
            <p className="flex items-center text-colorBlack text-xl font-semibold">
              Confirmation Modal
            </p>
          </div>

          <div className="p-5 text-colorBlack text-lg font-normal">
            <b className="text-colorSecondary">Warning : </b>
            All of your records will get removed permanently. Be aware that this
            action is irreversible.
          </div>

          <div className="container mt-5 flex items-center justify-end gap-3">
            <Button
              variant="outlined"
              className="rounded-md capitalize text-colorBlack py-2 px-5"
              onClick={() => {
                setDeleteModalOpen(false);
                setDeleteSelected(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className={`${
                deleteLoader && "flex gap-3"
              } rounded-md capitalize !text-colorWhite !bg-red-600 hover:!bg-red-600 py-2 px-5`}
              onClick={onClickItemDelete}
            >
              {deleteLoader && (
                <CircularProgress className="!text-white !h-5 !w-5" />
              )}
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </Box>
    </CustomAuthModal>
  );
};

export default DeleteAccountConfirmationModal;
