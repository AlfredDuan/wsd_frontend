import http from "./httpService";
import parse from "csv-parse/lib/sync";

export const getMeterOptions = (meters) => {
  let meterOptions = [
    {
      label: "Hong Kong",
      value: "HKI",
      locationTags: [],
    },
    {
      label: "Kowloon",
      value: "KLN",
      locationTags: [],
    },
    {
      label: "New Territories East 1",
      value: "NTE1",
      locationTags: [],
    },
    {
      label: "New Territories East 2",
      value: "NTE2",
      locationTags: [],
    },
    {
      label: "New Territories West",
      value: "NTW",
      locationTags: [],
    },
  ];

  for (let meter of meters) {
    let locationTags = meterOptions.find((x) => x.value === meter.regionTag)
      .locationTags;

    let locationTag = locationTags.find((x) => x.value === meter.locationTag);
    if (!locationTag) {
      locationTag = {
        label: meter.location,
        value: meter.locationTag,
        meterTags: [
          {
            label: meter.meterTag,
            value: meter.meterTag,
          },
        ],
      };
      locationTags.push(locationTag);
    } else {
      locationTag.meterTags.push({
        label: meter.meterTag,
        value: meter.meterTag,
      });
    }
  }

  return meterOptions;
};

export async function getWaterFlowMetersFromDB() {
  const { data: result } = await http.get(`/water-flow-meters`);
  return result.data;
}

const meterFileHeaderMap = {
  "SSS METER NO.": "meterNo",
  "SIS REGION TAG": "regionTag",
  "SIS LOCATION TAG": "locationTag",
  "SIS METER TAG": "meterTag",
  "SIS FULL TAG": "fullTag",
  LOCATION: "location",
  "METER DESCRIPTION": "meterDescription",
};

function meterFileToObject(content) {
  const index = content.indexOf("\n");
  const headerStr = content.substring(0, index);
  const mappedHeader = headerStr
    .split(",")
    .map((x) => meterFileHeaderMap[x.trim()])
    .join();

  const fileContent = mappedHeader + content.substring(index);

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
  return records;
}

export async function uploadMeterFiles(files) {
  let allRecords = [];
  for (let file of files) {
    const newRecords = await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function (event) {
        let records = meterFileToObject(event.target.result);
        resolve(records);
      };
      reader.readAsText(file);
    });
    allRecords = allRecords.concat(newRecords);
  }

  const result = await http.post(`/water-flow-meters`, {
    meters: allRecords,
  });
  return result;
}
