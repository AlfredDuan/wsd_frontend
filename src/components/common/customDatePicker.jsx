import React from "react";
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from '@material-ui/core/FormHelperText';

function CustomDatePicker(props) {
  return (
    <FormControl
      className={props.classes.formControl}
      fullWidth={props.fullWidth}
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          disableToolbar={false}
          format="yyyy-MM-dd"
          margin="normal"
          maxDate={props.maxDate}
          minDate={props.minDate}
          disabled={props.disabled}
          readOnly={props.readOnly}
          allowKeyboardControl={false}
          id={props.name}
          label={props.label}
          name={props.name}
          value={props.value}
          onChange={props.handleChange}
        />
      </MuiPickersUtilsProvider>
      { props.message && <FormHelperText id="my-helper-text">{props.message}</FormHelperText> }
    </FormControl>
  );
}

export default CustomDatePicker;
