import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectSmall({
  options,
  latestProduct,
  onChange,
  value,
}) {
  const handleChange = (event) => {
    onChange(event);
  };

  return (
    <FormControl sx={{ minWidth: 120 }} size="small">
      <label
        htmlFor="products"
        className="block mb-1 font-medium text-gray-700"
      >
        Products
      </label>
      {/* <InputLabel id="demo-select-small">Age</InputLabel> */}
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option?.name} - {option?.pack} {option?.unitOfMeasure} -{" "}
            <span className="font-bold ml-1">
              {" "}
              Rs.{option?.mrp}
              {"/- "}
            </span>
            {latestProduct?.includes(option) && (
              <span className="inline-block ml-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs">
                New
              </span>
            )}
          </MenuItem>
        ))}
        {/* <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem> */}
      </Select>
    </FormControl>
  );
}
