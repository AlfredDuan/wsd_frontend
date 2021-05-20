import { getWaterFlowMetersFromDB } from "../services/infoService";

export async function getWaterFlowMeters() {
  const waterFlowMeters = await getWaterFlowMetersFromDB();
  return waterFlowMeters;
}

export function getMeterInfo(meters, locationTag_meterTag) {
  if (!meters) return null;

  let lastIndex = locationTag_meterTag.lastIndexOf("_");
  const locationTag = locationTag_meterTag.substr(0, lastIndex);
  const meterTag = locationTag_meterTag.substr(lastIndex + 1);

  const meter = meters.find(
    (x) => x.locationTag === locationTag && x.meterTag === meterTag
  );
  if (meter) {
    const region = meter.regionTag;
    const locationTag = meter.locationTag;
    const meterTag = meter.meterTag;

    return { region, locationTag, meterTag };
  }
  return null;
}
