"use client";
import { Modal, Box, Typography, Button, Zoom } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { loadSubscriptionStart } from "../../redux/ducks/subscriptions";
import { useDispatch, useSelector } from "react-redux";

const style = {
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 5,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
  outline: "none",
};

const PaymentSuccessModal = ({
  open,
  onClose,
  title,
  message,
  note,
  successModalCloseProcess = false,
}) => {
  return (
    <Modal
      open={open}
      aria-labelledby="payment-success-title"
      aria-describedby="payment-success-description"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Zoom in={open} timeout={400}>
        <Box sx={style} className="w-[90%] md:w-[75%] lg:w-2/5 xl:w-2/6">
          {/* Success Icon */}
          <CheckCircleOutlineIcon sx={{ fontSize: 120, color: "#29977E" }} />
          <Box className="flex flex-col gap-2">
            {/* Title */}
            <Typography
              id="payment-success-title"
              variant="h4"
              fontWeight="bold"
              textAlign="center"
            >
              {title} {/* Payment Successful */}
            </Typography>

            {/* Description */}
            <Typography
              id="payment-success-description"
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              {message}
              {/* Your payment has been processed successfully. */}
            </Typography>

            {note && (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 400,
                  textAlign: "center",
                  color: "text.secondary",
                }}
              >
                <span className="font-semibold text-black">Note: </span>
                {note}
              </Typography>
            )}
          </Box>

          {/* Action Button */}
          <Button
            onClick={onClose}
            variant="contained"
            className={`${
              successModalCloseProcess && "opacity-50"
            } text-[#fff] !bg-colorGreen !font-semibold !shadow-none !rounded-lg`}
            fullWidth
          >
            Continue{successModalCloseProcess && "..."}
          </Button>
        </Box>
      </Zoom>
    </Modal>
  );
};

export default PaymentSuccessModal;
