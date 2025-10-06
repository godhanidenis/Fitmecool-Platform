import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { loadSubscriptionStart } from "../../redux/ducks/subscriptions";
import { useDispatch, useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

const PaymentSuccessModal = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

  const handleClose = () => {
    dispatch(loadSubscriptionStart({ shopId: vendorShopDetails.id }));
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="payment-success-title"
      aria-describedby="payment-success-description"
    >
      <Box sx={style}>
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Success Icon */}
        <CheckCircleOutlineIcon
          sx={{ fontSize: 70, color: "#29977E", mb: 2 }}
        />

        {/* Title */}
        <Typography id="payment-success-title" variant="h6" fontWeight="bold">
          Payment Successful 🎉
        </Typography>

        {/* Description */}
        <Typography
          id="payment-success-description"
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, mb: 3 }}
        >
          Your payment has been processed successfully.
        </Typography>

        {/* Action Button */}
        <Button
          onClick={handleClose}
          variant="contained"
          className="text-[#fff] !bg-colorGreen"
          fullWidth
        >
          Continue
        </Button>
      </Box>
    </Modal>
  );
};

export default PaymentSuccessModal;
