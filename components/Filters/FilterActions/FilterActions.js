import { Divider, Stack, Switch } from "@mui/material";
import { useState } from "react";

const FilterActions = ({ byShop, setByShop, productByShop }) => {
  const [checked, setChecked] = useState(byShop);

  const switchHandler = (event) => {
    setChecked(event.target.checked);
    setByShop(event.target.checked);
  };

  return (
    <div>
      <div className="pt-5 pb-2 px-10 flex items-center justify-between w-full">
        <span className="text-black text-[22px] font-bold">Filters</span>
        {!productByShop && (
          <Stack direction="row" alignItems="center">
            <span>Product</span>
            <Switch
              checked={checked}
              onChange={switchHandler}
              color="secondary"
            />
            <span>Shop</span>
          </Stack>
        )}
      </div>
      <Divider className="mx-6" />
    </div>
  );
};

export default FilterActions;
