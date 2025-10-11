import { Modal, Box, Typography, Avatar, Zoom } from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
const CommonConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon: Icon = PriorityHighIcon,
  iconColor = "primary.main",
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Zoom in={open} timeout={400}>
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            outline: "none",
          }}
          className="w-[90%] md:w-[60%] lg:w-[50%] xl:w-[30%]"
        >
          <Avatar
            sx={{
              bgcolor: iconColor,
              width: 70,
              height: 70,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon sx={{ fontSize: 34, color: "white" }} />
          </Avatar>
          <Box className="flex flex-col gap-2">
            <Typography
              id="plan-modal-title"
              component="h2"
              sx={{ fontWeight: 700, fontSize: 30, textAlign: "center" }}
            >
              {title}
            </Typography>

            <Typography
              id="plan-modal-description"
              variant="inherit"
              sx={{ fontWeight: 500, textAlign: "center", color: "gray" }}
            >
              {message}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={2} width="100%">
            <button
              style={{
                borderColor: iconColor,
                color: iconColor,
              }}
              className={`border-2 w-[120px] p-1.5 rounded-md font-semibold`}
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              style={{
                borderColor: iconColor,
                backgroundColor: iconColor,
              }}
              className={`border-2 text-white w-[120px] p-1.5 rounded-md font-semibold`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </Box>
        </Box>
      </Zoom>
    </Modal>
  );
};

export default CommonConfirmationModal;
