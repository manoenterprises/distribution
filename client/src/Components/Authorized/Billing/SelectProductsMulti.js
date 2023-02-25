import React from "react";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";

const MultiSelectField = ({
  label,
  name,
  options,
  values,
  onChange,
  latestProduct,
  errors,
  handleBlur,
}) => {
  const handleChange = (event) => {
    onChange(event);
  };

  return (
    <FormControl fullWidth error={errors}>
      {/* <InputLabel>{label}</InputLabel> */}
      <label
        htmlFor="products"
        className="block mb-1 font-medium text-gray-700"
      >
        Products
      </label>
      <Select
        multiple
        value={values}
        name="products"
        size="small"
        error={errors}
        onChange={handleChange}
        onBlur={handleBlur}
        inputProps={{ name: name }}
        renderValue={(selected) => (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={`${value?.name} - ${value?.pack} ${value?.unitOfMeasure}`}
                style={{ margin: 2 }}
              />
            ))}
          </div>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option?.name} - {option?.pack} {option?.unitOfMeasure} -{" "}
            <span className="font-bold ml-1">
              {" "}
              Rs.{option?.mrp}
              {"/- "}
            </span>
            {latestProduct.includes(option) && (
              <span className="inline-block ml-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs">
                New
              </span>
            )}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelectField;
