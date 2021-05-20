import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  stepper: {
    padding: 0,
    marginBottom: 10,
    background: "#fafafa",
    outline: "none !important",
  },
}));

function getSteps() {
  return ["Search", "Plot"];
}

export default function HorizontalNonLinearStepper(props) {
  const classes = useStyles();
  const steps = getSteps();

  return (
    <div className={classes.root}>
      <Stepper
        className={classes.stepper}
        nonLinear
        activeStep={props.activeStep}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={() => props.handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
