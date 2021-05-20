import React, { useState} from "react";
import MaterialTable from "material-table";

import {
  getAdditionalFunction,
} from "../../services/settingService";
import { additionalTypeFields } from "../../utils/settings";

export default function EventTypes() {
  const [state] = useState({
    columns: additionalTypeFields,
  });

  const applyFunction = async () => {
    const result = await getAdditionalFunction();
    console.log("data"+ JSON.stringify(result));
    if (result.status === 200) {
      alert("apply success");
    } else {
      alert("apply fail");
    }
  };


  return (
    <MaterialTable
      title="Additional function"
      columns={state.columns}
      data={[{operation:"Training",description:"Train the model"}]}
      actions={[
        {
            icon: "save",
            tooltip: "apply to train model",
            onClick: () => applyFunction()
        }
        ]}
    />
  );
}
