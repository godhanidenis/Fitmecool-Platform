import { Button } from "@mui/material";
import { useState } from "react";
// import { Switch } from "@mui/material";
import Switch from "react-switch";

const FilterActions = ({ byShop, setByShop, productByShop }) => {
  const [checked, setChecked] = useState(byShop);

  const switchHandler = (event) => {
    setChecked(event.target.checked);
    setByShop(event.target.checked);
  };

  return (
    <>
      <div className="mb-2 flex justify-between gap-1">
        <Button
          className="bg-colorPrimary px-6  text-colorWhite"
          sx={{
            textTransform: "none",
            height: "38px",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
          variant="contained"
          size="small"
        >
          Filter By
        </Button>
        {!productByShop && (
          <div className="flex items-center gap-2">
            {/* <Switch
            className="react-switch"
            onChange={switchHandler}
            checked={checked}
            height={44}
            width={250}
            offHandleColor="#ffffff"
            onHandleColor="#ffffff"
            offColor="#95539B"
            onColor="#95539B"
            handleDiameter={28}
            borderRadius={3}
            checkedIcon={
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  fontSize: "15px",
                  color: "white",
                  paddingRight: "2px",
                  whiteSpace: "nowrap",
                  paddingLeft: "8px",
                  // width: "130px",
                  // background: "white"
                }}
              >
                Filter By Product
              </p>
            }
            uncheckedIcon={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  fontSize: 15,
                  color: "white",
                  whiteSpace: "nowrap",
                  float: "right",
                  paddingRight: "8px",
                }}
              >
                Filter By Shop
              </div>
            }
            required
          /> */}
            <label className="inline-flex border-2 cursor-pointer dark:bg-white-300 dark:text-white-800">
              <input
                id="Toggle4"
                type="checkbox"
                className="hidden peer"
                onChange={switchHandler}
              />
              <span className="px-4 py-1 bg-colorPrimary peer-checked:text-black peer-checked:bg-white text-white">
                Product
              </span>
              <span className="px-4 py-1 dark:bg-white-300 peer-checked:bg-colorPrimary peer-checked:text-white ">
                Shop
              </span>
            </label>
          </div>
        )}
      </div>
    </>
  );
};

export default FilterActions;
