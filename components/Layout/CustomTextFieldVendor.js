import React from "react";

const CustomTextFieldVendor = ({
  label,
  type,
  id,
  placeholder,
  isRequired,
  formValue,
  ...rest
}) => {
  return (
    <>
      <label
        htmlFor={id}
        className={`absolute  left-5 px-2 bg-white font-semibold sm:text-xl text-sm ${
          isRequired ? "-top-4" : "sm:-top-4 -top-3 "
        }`}
      >
        {label}
        <span
          className={`required text-red-500 pl-2 sm:text-2xl text-lg ${
            !isRequired && "hidden"
          }`}
        >
          *
        </span>
      </label>
      <input
        type={type}
        id={id}
        className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
        placeholder={placeholder}
        {...formValue}
        {...rest}
      />
    </>
  );
};

export default CustomTextFieldVendor;
