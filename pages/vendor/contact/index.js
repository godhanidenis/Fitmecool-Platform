import React from "react";
import CustomTextFieldVendor from "../../../components/core/CustomTextFieldVendor";
import { useForm } from "react-hook-form";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const index = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm();

  const onSubmit = async (data) => {
    console.log("data", data);
  };

  return (
    <div className="p-5">
      <div>
        <button
          className="p-2 flex justify-center cursor-pointer"
          onClick={() => window.history.back()}
        >
          <ArrowBackIosIcon />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center h-[80vh] p-5">
        <div className="p-5 shadow-md rounded-xl  w-full sm:w-[75%] border">
          <h1 className="text-colorBlack text-center font-semibold text-4xl p-2">
            Contact Us
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            <div className="flex flex-col gap-5">
              <div className="w-full">
                <CustomTextFieldVendor
                  name="vendor_email"
                  label="Email*"
                  type="email"
                  id="vendorEmail"
                  isRequired={true}
                  placeholder="Enter your email"
                  formValue={{
                    ...register("vendor_email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "*Please enter a valid email",
                      },
                    }),
                  }}
                />
                {errors.vendor_email && (
                  <div className="mt-2">
                    <span style={{ color: "red" }}>
                      {errors.vendor_email?.message}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-full">
                <CustomTextFieldVendor
                  name="description"
                  label="Anything else?*"
                  type="text"
                  id="description"
                  multiline
                  rows={4}
                  isRequired={true}
                  placeholder="Tell us about your budget, needs, and timeline."
                  formValue={{
                    ...register("description", {
                      required: "Description is required",
                    }),
                  }}
                />
                {errors.description && (
                  <div className="mt-2">
                    <span style={{ color: "red" }}>
                      {errors.description?.message}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <button
                  className="h-14 flex items-center justify-center text-white w-full bg-colorPrimary rounded-xl text-xl max-[480px]:h-10 max-[480px]:text-sm"
                  type="submit"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default index;
