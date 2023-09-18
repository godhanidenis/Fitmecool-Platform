import { Avatar } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { getReviewedTimeString } from "../../../utils/common";

// const ShopCommentsSection = ({ review }) => {
//   return (
//     <div className="flex justify-center border-b mt-10">
//       <div className="grid grid-cols-12 px-4 w-full">
//         <div className="col-span-12">
//           <div className="flex items-center">
//             <div className="flex justify-center items-center">
//               <Avatar sx={{ width: 56, height: 56 }} />
//             </div>
//             <div className="flex flex-col w-full">
//               <div className="flex justify-between flex-wrap md:flex-nowrap ml-[2%]">
//                 <div className="flex items-start sm:gap-10 gap-[6px] w-full sm:justify-start">
//                   <div className="flex flex-col">
//                     <div className="font-semibold sm:text-xl text-lg text-[#000000]">
//                       {review.user_name}
//                     </div>
//                     <div className=" text-[#888888]">
//                       {getReviewedTimeString(review?.updatedAt)}
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-1 bg-colorGreen rounded ">
//                     <StarIcon fontSize="small" className="!text-white pl-1" />
//                     <p className="text-white pr-[6px] font-semibold">
//                       {review.stars}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* <div className="col-span-12 items-center text-sm flex py-3 font-normal gap-2.5">
//           {review.message}
//         </div> */}
//       </div>
//     </div>
//   );
// };

const ShopCommentsSection = ({ review }) => {
  return (
    <div className="flex justify-center border-b mt-10 relative">
      <div className="grid grid-cols-12 w-full">
        <div className="col-span-12">
          <div className="flex gap-2">
            <div className="flex justify-center">
              <Avatar sx={{ width: 56, height: 56 }} />
            </div>
            <div className="flex flex-col w-full">
              <div className="flex justify-between flex-wrap md:flex-nowrap ml-[2%]">
                <div className="flex items-start sm:gap-10 gap-[6px] w-full sm:justify-start">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-5">
                      <div className="font-semibold sm:text-xl text-lg text-[#000000]">
                        {review.user_name}
                      </div>
                      <div className="flex items-center gap-1 bg-colorGreen rounded ml-2">
                        <StarIcon
                          fontSize="small"
                          className="!text-white pl-1"
                        />
                        <p className="text-white pr-[6px] font-semibold">
                          {review.stars}
                        </p>
                      </div>
                    </div>
                    <div className=" text-[#888888]">
                      {getReviewedTimeString(review?.updatedAt)}
                    </div>
                    <div className="col-span-12 items-center text-sm flex py-3 font-normal gap-2.5">
                      {review.message}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCommentsSection;
