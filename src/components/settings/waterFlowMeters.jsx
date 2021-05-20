import React, { useState, useContext } from "react";
import MaterialTable from "material-table";
import { useSnackbar } from "notistack";
import InfoContext from "../../context/infoContext";
import UploadMetersInfo from "./uploadMetersInfo";

export default function WaterFlowMeters() {
  const [openUpload, setOpenUpload] = useState(false);
  const { meters, retrieveMetersInfo } = useContext(InfoContext);
  const { enqueueSnackbar } = useSnackbar();

  const updatedMeterInfo = () => {
    retrieveMetersInfo();
    enqueueSnackbar(`Information of Water Flow Meters is updated.`, {
      variant: "success",
    });
  };

  return (
    <>
      <UploadMetersInfo
        open={openUpload}
        setOpen={setOpenUpload}
        updatedMeterInfo={updatedMeterInfo}
      />
      <MaterialTable
        title="Water Flow Meters Infomation"
        columns={[
          {
            title: "Region",
            field: "regionTag",
            lookup: {
              HKI: "Hong Kong Island",
              KLN: "Kowloon",
              NTE1: "NT East 1",
              NTE2: "NT East 2",
              NTW: "NT West",
            },
          },
          { title: "Location", field: "location" },
          { title: "Location Tag", field: "locationTag" },
          { title: "Meter Tag", field: "meterTag" },
          { title: "Full Tag", field: "fullTag" },
          { title: "Meter Description", field: "meterDescription" },
        ]}
        data={meters}
        options={{
          filtering: true,
        }}
        actions={[
          {
            icon: "cloud_upload",
            tooltip: "Upload CSV",
            isFreeAction: true,
            onClick: () => setOpenUpload(true),
          },
        ]}
      />
    </>
  );
}
