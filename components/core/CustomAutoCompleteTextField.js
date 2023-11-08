import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller } from "react-hook-form";

const CustomAutoCompleteTextField = ({
  id,
  name,
  control,
  rules,
  label,
  placeholder,
  subBranchSelect,
  onChangeValue,
  arrayListItem,
  stateField,
  cityField,
  pinCodeField,
  branchText,
  setBranchText,
}) => {
  const LabelFunction = (item) => {
    if (stateField) {
      return item.state || "";
    } else if (cityField) {
      return item.city || "";
    } else if (pinCodeField) {
      return `${item.area || ""} - ${item.pin || ""}`;
    }
  };

  const ValueFunction = (item) => {
    if (stateField) {
      return item.state || "";
    } else if (cityField) {
      return item.city || "";
    } else if (pinCodeField) {
      return item.pin || "";
    }
  };
  const areaListsWithCombinedLabels = arrayListItem?.map((item) => ({
    label: LabelFunction(item),
    value: ValueFunction(item),
  }));
  return subBranchSelect ? (
    <Autocomplete
      disablePortal
      onChange={(item, value) => {
        setBranchText(value?.label);
        onChangeValue(value?.label);
      }}
      id={id}
      fullWidth
      value={branchText}
      options={areaListsWithCombinedLabels}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
    />
  ) : (
    <Controller
      control={control}
      render={({ field: { onChange, value } }) => {
        console.log("value123 :>> ", value);
        return (
          <Autocomplete
            disablePortal
            onChange={(item, value) => {
              onChange(value?.label);
              onChangeValue(value?.label);
            }}
            id={id}
            fullWidth
            value={value || ""}
            options={arrayListItem?.length > 0 && areaListsWithCombinedLabels}
            renderInput={(params) => (
              <TextField {...params} label={label} placeholder={placeholder} />
            )}
          />
        );
      }}
      name={name}
      rules={rules}
    />
  );
};

export default CustomAutoCompleteTextField;
