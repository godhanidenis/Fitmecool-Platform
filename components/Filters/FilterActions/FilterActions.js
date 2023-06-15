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
      <div className="p-2 items-center">
        <span>
          <b className="text-[black] text-[22px] uppercase">Filters</b>
        </span>

        {!productByShop && (
          <div className="flex items-center gap-2 mt-6 w-full">
            <label className="inline-flex border-2 cursor-pointer dark:bg-white-300 dark:text-white-800 w-full">
              <input
                id="Toggle4"
                type="checkbox"
                className="hidden peer"
                onChange={switchHandler}
              />
              <span className="py-4 bg-[#29977E] peer-checked:text-black peer-checked:bg-[#F0F3F4] text-white w-full text-center">
                Product
              </span>
              <span className="py-4 dark:bg-white-300 bg-[#F0F3F4] peer-checked:bg-[#29977E] text-black peer-checked:text-white w-full text-center">
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
