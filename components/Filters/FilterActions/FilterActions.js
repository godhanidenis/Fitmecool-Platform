import { useState, useEffect } from "react";
import { Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { changeByShopFilters } from "../../../redux/ducks/shopsFilters";
import CustomSwitchComponent from "../../core/CustomSwitchComponent";
import { assets } from "../../../constants";
import Image from "next/image";

const FilterActions = ({ productByShop }) => {
  const { byShop } = useSelector((state) => state.shopsFiltersReducer);

  const [checked, setChecked] = useState(byShop);

  const dispatch = useDispatch();

  const switchHandler = (event) => {
    setChecked(event.target.checked);
    dispatch(changeByShopFilters(event.target.checked));
  };

  useEffect(() => {
    setChecked(byShop);
  }, [byShop]);

  return (
    <div>
      <div className="pt-5 pb-2 px-5 sm:px-10 flex items-center justify-between w-full">
        <span className="text-black text-[22px] font-bold">Filters</span>
        {!productByShop && (
          <CustomSwitchComponent checked={checked} onChange={switchHandler} />
        )}
      </div>
      <Divider className="!mx-6" />
    </div>
  );
};

export default FilterActions;
