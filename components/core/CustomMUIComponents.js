import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Modal,
  Tabs,
  Typography,
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

export const CustomAuthModal = styled(Modal)(({ theme }) => ({
  [`& .MuiBackdrop-root`]: {
    backgroundColor: "transparent !important",
  },
}));

export const CustomTab = styled(Tabs)(({ theme }) => ({
  [`& .MuiTab-root`]: {
    textTransform: "none",
    color: "#FFFFFF",
    fontWeight: 600,
    fontSize: "14px",
    paddingTop: "32px",
    paddingBottom: "32px",
  },
  [`& .MuiTab-root:hover`]: {
    color: "#29977E !important",
  },
  [`& .Mui-selected:hover`]: {
    color: "#29977E !important",
  },
  [`& .Mui-selected`]: {
    fontWeight: 600,
    fontSize: "16px",
    color: "#29977E !important",
  },
  [`& .MuiTabs-indicator`]: {
    backgroundColor: "#29977E !important",
    height: "5px",
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
      color: "#000000",
    },
    ".MuiCheckbox-root.Mui-checked": {
      color: "#29977E",
    },
  })
);
