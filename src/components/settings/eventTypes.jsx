import React, { useState, useEffect, useContext } from "react";
import MaterialTable from "material-table";
import { useSnackbar } from "notistack";

import {
  getEventTypes,
  updateEventTypes,
  deleteEventTypes,
} from "../../services/settingService";
import { eventTypeFields } from "../../utils/settings";
import InfoContext from "../../context/infoContext";

export default function EventTypes() {
  const [state, setState] = useState({
    columns: eventTypeFields,
    data: [],
  });
  const { enqueueSnackbar } = useSnackbar();
  const { updateEventDict } = useContext(InfoContext);

  useEffect(() => {
    const retrieveData = async () => {
      const result = await getEventTypes();
      console.log("data:"+ JSON.stringify(result));
      const lState = { ...state };
      lState.data = result.data;
      setState(lState);
    };

    retrieveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async (index, newData) => {
    const result = await updateEventTypes(index, newData);

    if (result.status === 200) {
      updateEventDict();
      enqueueSnackbar(`Event Type is updated.`, {
        variant: "success",
      });
      return true;
    } else {
      enqueueSnackbar(
        `Event Type canont be updated. Message: ${result.data.message}`,
        {
          variant: "error",
        }
      );
      return false;
    }
  };

  const handleDelete = async (index) => {
    const result = await deleteEventTypes(index);

    if (result.status === 200) {
      updateEventDict();
      enqueueSnackbar(`Event type is deleted.`, {
        variant: "success",
      });
      return true;
    } else {
      enqueueSnackbar(
        `Event type canont be deleted. Message: ${result.data.message}`,
        {
          variant: "error",
        }
      );
      return false;
    }
  };

  return (
    <MaterialTable
      title="Event Types"
      columns={state.columns}
      data={state.data}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(async () => {
              resolve();
              if (await handleUpdate(-1, newData)) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data.push(newData);
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(async () => {
              resolve();
              if (
                oldData &&
                (await handleUpdate(state.data.indexOf(oldData), newData))
              ) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(async () => {
              resolve();
              if (await handleDelete(state.data.indexOf(oldData))) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data.splice(data.indexOf(oldData), 1);
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
      }}
    />
  );
}
