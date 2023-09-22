import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {
  Box,
  Checkbox,
  Dialog,
  FormControlLabel,
  LinearProgress,
  Modal,
  Paper,
  Select,
  Tabs,
  Typography,
  linearProgressClasses,
} from "@mui/material";
import PropTypes from "prop-types";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

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
      paddingBottom: collection ? "0px" : "4px",
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
      height: collection ? "3px" : "3px",
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
    marginRight: "16px",

    [theme.breakpoints.down("sm")]: {
      fontSize: "14px",
      paddingX: "16px",
      paddingY: "12px",
    },
  },

  [`& .MuiTabScrollButton-root`]: {
    color: "yellow",
  },

  [`& .Mui-selected`]: {
    backgroundColor: "#FFF",
    borderRadius: "10px",
    color: "#151827 !important",
    fontWeight: 500,
    margin: "10px",
    padding: "0px 10px",
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

export const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#95539B",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#95539B",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#95539B",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#95539B",
    zIndex: 1,
    fontSize: 24,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

export function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {active ? (
        <RadioButtonCheckedIcon className="QontoStepIcon-completedIcon" />
      ) : completed ? (
        <CheckCircleOutlineIcon className="QontoStepIcon-completedIcon" />
      ) : (
        <RadioButtonUncheckedIcon className="QontoStepIcon-completedIcon" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

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
  "& .MuiDialog-backdrop": {
    backgroundColor: "#CAA9CD !important",
  },
  "& .MuiDialog-paper": {
    top: 0,
    position: "absolute",
    height: "50vh",
    width: "100vw",
    maxHeight: "100%",
    maxWidth: "100%",
    margin: "0px",
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
    color: "#1518278F",
    marginLeft: 10,
  },
}));
