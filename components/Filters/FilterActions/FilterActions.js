import { Divider } from "@mui/material";
import { useState } from "react";
import Switch from "react-switch";

const FilterActions = ({ byShop, setByShop, productByShop }) => {
  const [checked, setChecked] = useState(byShop);

  const switchHandler = (event) => {
    setChecked(event.target.checked);
    setByShop(event.target.checked);
  };

  return (
    <>
      <div className="items-center">
        <div className="pt-5 pb-2 px-10">
          <span className="text-black text-[22px] font-bold">Filters</span>
        </div>
        <Divider className="mx-6" />
        {!productByShop && (
          <div className="flex items-center gap-2 mt-6 w-full px-10">
            <label className="inline-flex border-2 cursor-pointer dark:bg-white-300 dark:text-white-800 w-full">
              <input
                id="Toggle4"
                type="checkbox"
                className="hidden peer"
                onChange={switchHandler}
              />
              <span className="py-2 bg-colorGreen peer-checked:text-black peer-checked:bg-[#F0F3F4] text-white w-full text-center">
                Product
              </span>
              <span className="py-2 dark:bg-white-300 bg-[#F0F3F4] peer-checked:bg-colorGreen text-black peer-checked:text-white w-full text-center">
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
