import React, { useEffect, useContext, useCallback } from "react";
import moment from "moment";
import { useSnackbar } from "notistack";
import _ from "lodash";
import { checkClassifiedEvent } from "../utils/helpers";

import SelectableTable from "./common/selectableTable";
import InfoContext from "../context/infoContext";

import { getAbnormalities } from "../services/readingService";
import { getMeterInfo } from "../utils/info";

const HomeTable = () => {
  const [fullRows, setFullRows] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

  const { meters, setSelectedAbns, eventDict, setProgressOn } = useContext(InfoContext);

  const [selectedKey, setSelectedKey] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    async function initRows() {
      setProgressOn(true);
      const { data: result } = await getAbnormalities({ status: "newFound" });

      const allRecords = result.data
        .map((abn) => {
          const meterInfo = getMeterInfo(meters, abn.locationTag_meterTag);
          if (meterInfo) {
            const { region, locationTag, meterTag } = meterInfo;
            return {
              name: `${moment(abn.date).format(
                "YYYY-MM-DD"
              )}%${region}%${locationTag}%${meterTag}`,
              date: `${moment(abn.date).format("YYYY-MM-DD")}`,
              region,
              locationTag,
              meterTag,
              classifiedEvent:
                eventDict[
                  checkClassifiedEvent(abn.classifiedCluster)
                ],
            };
          } else {
            console.log(
              "Error:  locationTag_meterTag: ",
              abn.locationTag_meterTag
            );
            return null;
          }
        })
        .filter((x) => x !== null);
      if (allRecords) {
        setFullRows(allRecords);
      }
      setProgressOn(false);    
    }

    if (meters) {
      initRows();
    }
    setSelectedAbns([]);
  }, [meters, setSelectedAbns, eventDict]);

  useEffect(() => {
    setSelectedAbns(selected);
  }, [selected, setSelectedAbns]);

  const delayedMessage = useCallback(
    _.debounce((msg) => enqueueSnackbar(msg, { variant: "info" }), 500),
    []
  );

  const selectableCheck = (name, allClickKey) => {
    const key = name.substring(name.indexOf("%") + 1);

    if (allClickKey !== undefined) {
      if (selected.length === 0 && key === allClickKey) {
        setSelectedKey(key);
        return true;
      } else if (key === selectedKey) {
        return true;
      }
      delayedMessage(
        "Some records with different location tag or mater tag are not selected."
      );
    } else {
      if (selectedKey === "" || selected.length === 0) {
        setSelectedKey(key);
        return true;
      } else if (key === selectedKey) {
        return true;
      }
      enqueueSnackbar(
        "Only records with the same location tag and mater tag can be selected.",
        { variant: "info" }
      );
    }

    return false;
  };

  const headCells = [
    {
      id: "date",
      disablePadding: true,
      label: "Date",
    },
    { id: "region", disablePadding: false, label: "Region" },
    {
      id: "locationTag",
      disablePadding: false,
      label: "Location Tag",
    },
    {
      id: "meterTag",
      disablePadding: false,
      label: "Meter Tag",
    },
    {
      id: "classifiedEvent",
      disablePadding: false,
      label: "Classified Event",
    },
  ];

  return (
    <div>
      <SelectableTable
        fullRows={fullRows}
        headCells={headCells}
        title="New Found Events"
        selectableCheck={selectableCheck}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
};

export default HomeTable;
