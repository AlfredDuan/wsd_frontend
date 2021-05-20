import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { useSnackbar } from "notistack";

import {
  getAccounts,
  updateAccount,
  deleteAccount,
} from "../../services/settingService";
import { accountFields } from "../../utils/settings";

export default function Accounts() {
  const [state, setState] = useState({
    columns: accountFields,
    data: [],
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const retrieveData = async () => {
      const result = await getAccounts();
      const lState = { ...state };
      lState.data = result.data.accounts;
      setState(lState);
    };

    retrieveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async (data) => {
    const result = await updateAccount(data);

    if (result.status === 200) {
      enqueueSnackbar(`Account info is updated.`, {
        variant: "success",
      });
      return true;
    } else {
      enqueueSnackbar(
        `Account info canont be updated. Message: ${result.data.message}`,
        {
          variant: "error",
        }
      );
      return false;
    }
  };

  const handleDelete = async (data) => {
    const result = await deleteAccount(data);

    if (result.status === 200) {
      enqueueSnackbar(`Account is deleted.`, {
        variant: "success",
      });
      return true;
    } else {
      enqueueSnackbar(
        `Account canont be deleted. Message: ${result.data.message}`,
        {
          variant: "error",
        }
      );
      return false;
    }
  };

  return (
    <MaterialTable
      title="Accounts Information"
      columns={state.columns}
      data={state.data}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(async () => {
              resolve();
              if (oldData && (await handleUpdate(newData))) {
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
              if (await handleDelete(oldData)) {
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
