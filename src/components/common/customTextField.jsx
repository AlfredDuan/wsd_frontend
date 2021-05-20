import React from "react";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

function CustomTextField({
  classes,
  label,
  name,
  value,
  margin = "dense",
  size = "normal",
  fullWidth = false,
  variant = "standard",
  multiline = false,
  rows = 1,
  readOnly = false,
  handleChange = () => {},
  disabled = false,
}) {
  return (
    <FormControl
      className={classes.formControl}
      fullWidth={fullWidth}
      margin={margin}
    >
      <TextField
        id={name}
        label={label}
        name={name}
        value={value}
        variant={variant}
        size={size}
        multiline={multiline}
        rows={rows}
        readOnly={readOnly}
        onChange={handleChange}
        disabled={disabled}
      />
    </FormControl>
  );
}
export default CustomTextField;
