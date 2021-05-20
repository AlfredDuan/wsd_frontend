import React from "react";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

function CustomSelect(props) {
  return (
    <FormControl
      className={props.classes}
      fullWidth={props.fullWidth}
      margin="normal"
    >
      <InputLabel htmlFor="age-native-simple">{props.label}</InputLabel>
      <Select
        native
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
        inputProps={{
          name: props.name,
          id: props.name,
        }}
        disabled={props.disabled}
      >
        <option aria-label="None" value="" />
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
export default CustomSelect;
