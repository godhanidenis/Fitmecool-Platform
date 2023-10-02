import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {
  Box,
  Dialog,
  FormControlLabel,
  LinearProgress,
  Modal,
  Paper,
  Select,
  Tabs,
  linearProgressClasses,
} from "@mui/material";
import PropTypes from "prop-types";

export const CustomTextField = styled(TextField)(({ theme }) => ({
  [`& .MuiInput-input`]: {
    fontWeight: 600,
    color: "#000000",
  },
  [`& .MuiInput-root:after`]: {
    borderBottom: 0,
  },
  [`& label`]: {
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "30px",
    color: "rgba(0, 0, 0, 0.6)",
  },
}));

export const CustomIconTextField = styled(TextField)(({ theme }) => ({
  [`& .MuiOutlinedInput-root`]: {
    color: "#919EAB",
    borderRadius: "3px",
    border: "1.8px solid #919EAB",
    fontSize: "16px",
    lineHeight: "15px",
    height: "33px",
    alignItems: "center",
    padding: "15px",
    paddingBottom: "20px",
    paddingTop: "20px",
    [theme.breakpoints.down("sm")]: {
      // Add your styles for the 'sm' breakpoint and up here
      fontSize: "10px",
      gap: "5px",
      paddingBottom: "12px",
      paddingTop: "12px",
    },
  },
  [`& .MuiInput-root:after`]: {
    border: 0,
  },
}));

export const CustomAuthModal = styled(Modal)(({ theme }) => ({
  [`& .MuiBackdrop-root`]: {
    backgroundColor: "transparent !important",
  },
}));

export const CustomTab = styled(Tabs)(
  ({ theme, hometab, collection, subheader }) => ({
    [`& .MuiTab-root`]: {
      textTransform: "none",
      color: hometab ? "#000" : collection ? "#31333e93" : "#FFFFFF",
      fontWeight: 600,
      fontSize: hometab ? "20px" : collection ? "18px" : "14px",
      marginTop: subheader && "24px",
      paddingTop: collection
        ? "0px"
        : hometab
        ? "16px"
        : subheader
        ? "0px"
        : "16px",
      paddingBottom: collection ? "0px" : subheader && "24px",
      paddingRight: hometab && "16px",
      paddingLeft: hometab && "16px",
      borderBottom: hometab && "3px solid #0000000a",

      [theme.breakpoints.down("lg")]: {
        paddingTop: collection && "16px",
        paddingBottom: collection && "16px",
      },
      [theme.breakpoints.down("md")]: {
        fontSize: hometab && "18px",
        paddingTop: collection && "16px",
        paddingBottom: collection && "16px",
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: (hometab || collection) && "16px",
      },
    },
    [`& .MuiTab-root:hover`]: {
      color: collection ? "black !important" : "#29977E !important",
    },
    [`& .Mui-selected:hover`]: {
      color: collection ? "black !important" : "#29977E !important",
    },
    [`& .Mui-selected`]: {
      fontWeight: 600,
      fontSize: hometab ? "20px" : collection ? "18px" : "16px",
      color: collection ? "black !important" : "#29977E !important",
      [theme.breakpoints.down("md")]: {
        fontSize: hometab && "18px",
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: (hometab || collection) && "16px",
      },
    },
    [`& .MuiTabs-indicator`]: {
      backgroundColor: collection ? "black !important" : "#29977E !important",
      height: subheader ? "5px" : "3px",
      [theme.breakpoints.down("md")]: {
        height: hometab && "3px",
      },
      [theme.breakpoints.down("sm")]: {
        height: hometab && "3px",
      },
    },
  })
);

export const CustomVenderShopTab = styled(Tabs)(({ theme }) => ({
  [`& .MuiTab-root`]: {
    textTransform: "none",
    color: "#fff",
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "16px",
    margin: "8px",

    [theme.breakpoints.down("sm")]: {
      fontSize: "14px",
    },
  },

  [`& .MuiTabScrollButton-root`]: {
    color: "yellow",
  },

  [`& .Mui-selected`]: {
    backgroundColor: "#FFF",
    borderRadius: "4px",
    color: "#151827 !important",
    fontWeight: 500,
  },
  [`& .MuiTabs-indicator`]: {
    display: "none",
  },
}));

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: props.padding }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const StyledFormLabelCheckBox = styled(FormControlLabel)(
  ({ theme, checked }) => ({
    ".MuiFormControlLabel-label": {
      color: `${checked ? "#29977E !important" : "#31333E"}`,
      fontSize: "15px",
      lineHeight: "14px",
    },
    ".MuiCheckbox-root": {
      color: "#31333e66",
    },
    ".MuiCheckbox-root.Mui-checked": {
      color: "#29977E",
    },
  })
);

export const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialog-paper": {
    top: 0,
    position: "absolute",
    height: "50vh",
    width: "100vw",
    maxHeight: "100%",
    maxWidth: "100%",
    margin: "0px",
    borderRadius: 0,
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export const LocationSelect = styled(Select)(({ theme }) => ({
  "& .MuiInputBase-input": {
    color: "white !important",
  },
  "& .MuiSelect-icon": {
    color: "white !important",
  },
}));

export const ShopHeaderItem = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fbfbfb",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow: "none",
}));

export const CustomBorderLinearProgress = styled(LinearProgress)(
  ({ theme }) => ({
    height: 12,
    borderRadius: "12px",
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: "rgba(24, 23, 37, 0.1)",
    },
    [`& .${linearProgressClasses.bar}`]: {
      backgroundColor: "rgba(21, 24, 39, 0.4)",
    },
  })
);

export const NativeSelectInput = styled(Select)(({ theme }) => ({
  "& .MuiInputBase-input": {
    marginLeft: 10,
  },
}));
